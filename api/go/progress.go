package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/inngest/inngestgo"
	"github.com/supabase-community/supabase-go"
)

// ProgressRequest expected payload
type ProgressRequest struct {
	UserID    string `json:"userId"`
	ProblemID string `json:"problemId"`
	Status    string `json:"status"` // "solved", "attempted"
}

// Inngest Event Payload
type ProgressEvent struct {
	Name string          `json:"name"`
	Data ProgressRequest `json:"data"`
	User interface{}     `json:"user"`
}

// Handler is the entry point for Vercel Serverless Function
func Handler(w http.ResponseWriter, r *http.Request) {
	// 1. CORS & Method Validation
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// 2. Decode Request
	var req ProgressRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	// 3. Supabase Setup
	supabaseUrl := os.Getenv("VITE_SUPABASE_URL")
	supabaseKey := os.Getenv("VITE_SUPABASE_ANON_KEY") // Or SERVICE_ROLE_KEY for admin
	client, err := supabase.NewClient(supabaseUrl, supabaseKey, nil)
	if err != nil {
		http.Error(w, "DB Conn Error", http.StatusInternalServerError)
		return
	}

	// 4. Save to DB (Example: Update raw_user_meta_data or a 'progress' table)
	// For simplicity, we assume the frontend handles DB writes via RLS,
	// and this API is for "Server-Side Verification & Streaks" trigger.
	// But per prompt, "Go APIs ... DB operations".
	// Let's insert into 'problem_progress' table.

	data := map[string]interface{}{
		"user_id":    req.UserID,
		"problem_id": req.ProblemID,
		"status":     req.Status,
		"updated_at": time.Now(),
	}

	// Upsert logic (requires handling conflicting keys, here assuming basic insert for demo)
	// In production, use client.From("problem_progress").Upsert(data).Execute()
	_, _, err = client.From("problem_progress").Insert(data, true, "user_id,problem_id", "", "").Execute()
	if err != nil {
		// Log but maybe don't fail if it's just a duplicate/update issue handled by RLS?
		// For now, treat as critical.
		fmt.Printf("DB Error: %v\n", err)
		http.Error(w, "Failed to save progress", http.StatusInternalServerError)
		return
	}

	// 5. Emit Inngest Event
	// Define Inngest Client
	eventKey := os.Getenv("INNGEST_EVENT_KEY")
	inngestClient := inngestgo.NewClient(inngestgo.ClientOpts{
		EventKey: &eventKey,
	})

	ctx := context.Background()
	event := inngestgo.Event{
		Name: "user.progress.updated",
		Data: map[string]interface{}{
			"userId":    req.UserID,
			"problemId": req.ProblemID,
			"status":    req.Status,
		},
		User: map[string]interface{}{
			"id": req.UserID,
		},
	}

	// Send event asynchronously (or sync if needed, async is better for latency)
	ids, err := inngestClient.Send(ctx, event)
	if err != nil {
		fmt.Printf("Inngest Error: %v\n", err)
		// Don't fail the request, just log
	}

	// 6. Response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":   true,
		"eventIds":  ids,
		"timestamp": time.Now(),
	})
}

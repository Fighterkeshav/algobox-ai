-- Security hardening: fill missing RLS policy and restrict admin table visibility.

-- Restrict admin user directory visibility to authenticated users only.
DROP POLICY IF EXISTS "Admins are viewable by everyone" ON public.admin_users;
CREATE POLICY "Authenticated users can view admins" ON public.admin_users
  FOR SELECT USING (auth.role() = 'authenticated');

-- Missing policy: users must be able to delete their own roadmap_progress rows.
CREATE POLICY "Users can delete own roadmap progress" ON public.roadmap_progress
  FOR DELETE USING (auth.uid() = user_id);

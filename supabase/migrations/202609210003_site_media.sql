-- First create a PUBLIC Storage bucket named site-media in the Dashboard.
-- Restrict the bucket to PNG, JPEG, WebP, MP4, and WebM, up to 50 MB each.
-- Only an active publisher may upload new files. We use unique paths, so no
-- update or delete policy is needed for the normal publishing workflow.
drop policy if exists "Active publishers upload site media" on storage.objects;
create policy "Active publishers upload site media"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'site-media'
    and (select public.is_active_publisher())
  );

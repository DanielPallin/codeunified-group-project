export type Lesson = {
  id: string;
  course_id: string;
  course_slug: string;
  title: string;
  slug: string;
  content: string;
  description: string;
  media_url: string | null;
  duration_seconds: number;
  sequence_order: number;
};
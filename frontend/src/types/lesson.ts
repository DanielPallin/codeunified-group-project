export type Lesson = {
  id: string;
  course_id: string;
  title: string;
  slug: string;
  content: string;
  description: string;
  media_url: string | null;
  duration_seconds: number;
  sequence_order: number;
  course_slug: string;
};
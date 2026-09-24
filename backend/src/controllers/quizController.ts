import type { Request, Response } from "express";
import pool from "../db.js";

export const getQuizByCourseSlug = async (req: Request, res: Response) => {
  try {
    const { courseSlug } = req.params;
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "You must be logged in to access the quiz",
      });
    }

    const subscriptionResult = await pool.query(
      `SELECT p.access_level
       FROM subscriptions s
       JOIN plans p ON s.plan_id = p.plan_id
       WHERE s.user_id = $1
       AND s.status = 'active'`,
      [userId],
    );

    const accessLevel = subscriptionResult.rows[0]?.access_level ?? 0;

    const questionLimit = accessLevel >= 3 ? 15 : accessLevel >= 2 ? 10 : 5;

    const result = await pool.query(
      `SELECT
        q.quiz_id,
        q.quiz_title,
        q.passing_score_percentage,
        qq.quiz_question_id,
        qq.question_text,
        qq.question_type,
        qq.sequence_order,
        qo.quiz_option_id,
        qo.option_text
       FROM quizzes q
       JOIN courses c
         ON q.course_id = c.course_id
       JOIN (
         SELECT *
         FROM quiz_questions
         WHERE quiz_id = (
           SELECT q2.quiz_id
           FROM quizzes q2
           JOIN courses c2
             ON q2.course_id = c2.course_id
           WHERE c2.course_slug = $1
           LIMIT 1
         )
         ORDER BY sequence_order ASC
         LIMIT $2
       ) qq
         ON qq.quiz_id = q.quiz_id
       JOIN quiz_options qo
         ON qo.quiz_question_id = qq.quiz_question_id
       WHERE c.course_slug = $1
       ORDER BY qq.sequence_order ASC`,
      [courseSlug, questionLimit],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    const questions = result.rows.reduce((acc: any[], row) => {
      let question = acc.find(
        (item) => item.quiz_question_id === row.quiz_question_id,
      );

      if (!question) {
        question = {
          quiz_question_id: row.quiz_question_id,
          question_text: row.question_text,
          question_type: row.question_type,
          sequence_order: row.sequence_order,
          options: [],
        };

        acc.push(question);
      }

      question.options.push({
        quiz_option_id: row.quiz_option_id,
        option_text: row.option_text,
      });

      return acc;
    }, []);

    res.json({
      quiz_id: result.rows[0].quiz_id,
      quiz_title: result.rows[0].quiz_title,
      passing_score_percentage: result.rows[0].passing_score_percentage,
      access_level: accessLevel,
      question_count: questions.length,
      questions,
    });
  } catch (error) {
    console.error("Error fetching quiz:", error);

    res.status(500).json({
      message: "Could not fetch quiz",
    });
  }
};

export const submitQuiz = async (req: Request, res: Response) => {
  try {
    const { courseSlug } = req.params;
    const userId = (req as any).user?.userId;
    const { answers } = req.body as {
      answers?: Record<string, string>;
    };

    if (!userId) {
      return res.status(401).json({
        message: "You must be logged in to submit the quiz",
      });
    }

    if (!answers) {
      return res.status(400).json({
        message: "Answers are required",
      });
    }

    const result = await pool.query(
      `SELECT
        qq.quiz_question_id,
        qo.quiz_option_id,
        qo.is_correct
       FROM quizzes q
       JOIN courses c
         ON q.course_id = c.course_id
       JOIN quiz_questions qq
         ON qq.quiz_id = q.quiz_id
       JOIN quiz_options qo
         ON qo.quiz_question_id = qq.quiz_question_id
       WHERE c.course_slug = $1`,
      [courseSlug],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    let correctAnswers = 0;

    const questionIds = new Set<string>();

    for (const row of result.rows) {
      questionIds.add(row.quiz_question_id);

      if (
        answers[row.quiz_question_id] === row.quiz_option_id &&
        row.is_correct
      ) {
        correctAnswers++;
      }
    }

    const totalQuestions = questionIds.size;

    const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

    const passingResult = await pool.query(
      `SELECT passing_score_percentage
       FROM quizzes q
       JOIN courses c
         ON q.course_id = c.course_id
       WHERE c.course_slug = $1`,
      [courseSlug],
    );

    const passingScore = passingResult.rows[0].passing_score_percentage;

    const passed = scorePercentage >= passingScore;

    res.json({
      correct_answers: correctAnswers,
      total_questions: totalQuestions,
      score_percentage: scorePercentage,
      passing_score_percentage: passingScore,
      passed,
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);

    res.status(500).json({
      message: "Could not submit quiz",
    });
  }
};

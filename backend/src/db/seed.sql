-- Seed data for RosterView development
-- This creates mock teachers, students, classes, and enrollments

-- Insert test teachers
INSERT INTO teachers (email, password_hash, first_name, last_name, role, school_id)
VALUES
  ('teacher1@wcpss.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/TVG2', 'Sarah', 'Johnson', 'teacher', 'SCH001'),
  ('teacher2@wcpss.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/TVG2', 'James', 'Smith', 'teacher', 'SCH001'),
  ('admin@wcpss.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/TVG2', 'Admin', 'User', 'admin', 'SCH001'),
  ('parent@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/TVG2', 'Parent', 'User', 'parent', 'SCH001')
ON CONFLICT (email) DO NOTHING;

-- Insert test students
INSERT INTO students (first_name, last_name, email, student_id, date_of_birth)
VALUES
  ('Alex', 'Anderson', 'alex.anderson@example.com', 'STU001', '2008-05-15'),
  ('Bailey', 'Brown', 'bailey.brown@example.com', 'STU002', '2008-07-22'),
  ('Casey', 'Chen', 'casey.chen@example.com', 'STU003', '2008-03-10'),
  ('Dakota', 'Davis', 'dakota.davis@example.com', 'STU004', '2008-09-18'),
  ('Emma', 'Evans', 'emma.evans@example.com', 'STU005', '2008-11-25'),
  ('Finley', 'Garcia', 'finley.garcia@example.com', 'STU006', '2008-02-14'),
  ('Gabriel', 'Garcia', 'gabriel.garcia@example.com', 'STU007', '2008-06-30'),
  ('Harper', 'Harris', 'harper.harris@example.com', 'STU008', '2008-08-08'),
  ('Indigo', 'Jackson', 'indigo.jackson@example.com', 'STU009', '2008-04-12'),
  ('Jordan', 'Johnson', 'jordan.johnson@example.com', 'STU010', '2008-10-05')
ON CONFLICT (student_id) DO NOTHING;

-- Insert test classes for teacher1
INSERT INTO classes (teacher_id, name, grade_level, period, school_year, description, infinite_campus_id, canvas_id)
VALUES
  ((SELECT id FROM teachers WHERE email = 'teacher1@wcpss.edu'), 'Biology 101', '9', '1', '2024-2025', 'Introductory Biology Course', 'IC-BIO101', 'CANVAS-BIO101'),
  ((SELECT id FROM teachers WHERE email = 'teacher1@wcpss.edu'), 'Chemistry 102', '10', '3', '2024-2025', 'Advanced Chemistry Course', 'IC-CHEM102', 'CANVAS-CHEM102')
ON CONFLICT DO NOTHING;

-- Insert test classes for teacher2
INSERT INTO classes (teacher_id, name, grade_level, period, school_year, description, infinite_campus_id, canvas_id)
VALUES
  ((SELECT id FROM teachers WHERE email = 'teacher2@wcpss.edu'), 'English 101', '9', '2', '2024-2025', 'English Literature and Composition', 'IC-ENG101', 'CANVAS-ENG101'),
  ((SELECT id FROM teachers WHERE email = 'teacher2@wcpss.edu'), 'History 102', '10', '4', '2024-2025', 'World History', 'IC-HIST102', 'CANVAS-HIST102')
ON CONFLICT DO NOTHING;

-- Enroll students in classes
INSERT INTO enrollments (class_id, student_id)
VALUES
  ((SELECT id FROM classes WHERE name = 'Biology 101' LIMIT 1), (SELECT id FROM students WHERE student_id = 'STU001' LIMIT 1)),
  ((SELECT id FROM classes WHERE name = 'Biology 101' LIMIT 1), (SELECT id FROM students WHERE student_id = 'STU002' LIMIT 1)),
  ((SELECT id FROM classes WHERE name = 'Biology 101' LIMIT 1), (SELECT id FROM students WHERE student_id = 'STU003' LIMIT 1)),
  ((SELECT id FROM classes WHERE name = 'Biology 101' LIMIT 1), (SELECT id FROM students WHERE student_id = 'STU004' LIMIT 1)),
  ((SELECT id FROM classes WHERE name = 'Biology 101' LIMIT 1), (SELECT id FROM students WHERE student_id = 'STU005' LIMIT 1)),
  ((SELECT id FROM classes WHERE name = 'English 101' LIMIT 1), (SELECT id FROM students WHERE student_id = 'STU003' LIMIT 1)),
  ((SELECT id FROM classes WHERE name = 'English 101' LIMIT 1), (SELECT id FROM students WHERE student_id = 'STU004' LIMIT 1)),
  ((SELECT id FROM classes WHERE name = 'English 101' LIMIT 1), (SELECT id FROM students WHERE student_id = 'STU006' LIMIT 1)),
  ((SELECT id FROM classes WHERE name = 'English 101' LIMIT 1), (SELECT id FROM students WHERE student_id = 'STU007' LIMIT 1)),
  ((SELECT id FROM classes WHERE name = 'English 101' LIMIT 1), (SELECT id FROM students WHERE student_id = 'STU008' LIMIT 1))
ON CONFLICT DO NOTHING;

-- Insert initial student status (all at school today)
INSERT INTO student_status (student_id, class_id, status, status_date)
SELECT s.id, c.id, 'school', CURRENT_DATE
FROM students s
CROSS JOIN classes c
WHERE NOT EXISTS (
  SELECT 1 FROM student_status ss
  WHERE ss.student_id = s.id AND ss.class_id = c.id AND ss.status_date = CURRENT_DATE
)
ON CONFLICT (student_id, class_id, status_date) DO NOTHING;

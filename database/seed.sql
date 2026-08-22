-- Online Quiz Maker - Sample Data
-- IMPORTANT: Run this AFTER schema.sql AND after creating the demo user.
-- The demo user must be created first by running:
--     cd backend
--     node utils/seedDemoUser.js
-- That script hashes a real password with bcryptjs (never store plain-text
-- passwords) and inserts a user with id = 1 on a fresh database.
-- This file then attaches sample quizzes to creator_id = 1.

-- Quiz 1: JavaScript Basics
INSERT INTO quizzes (title, description, creator_id) VALUES
('JavaScript Basics', 'Test your knowledge of JavaScript fundamentals including variables, functions, and data types.', 1);

INSERT INTO questions (quiz_id, question_text) VALUES
(1, 'Which keyword is used to declare a block-scoped variable in JavaScript?'),
(1, 'What does the "typeof" operator return for an array?'),
(1, 'Which method adds an element to the end of an array?'),
(1, 'What is the result of 3 + "3" in JavaScript?');

-- Q1 options (question_id = 1)
INSERT INTO options (question_id, option_text, is_correct) VALUES
(1, 'var', FALSE),
(1, 'let', TRUE),
(1, 'function', FALSE),
(1, 'global', FALSE);

-- Q2 options (question_id = 2)
INSERT INTO options (question_id, option_text, is_correct) VALUES
(2, 'array', FALSE),
(2, 'list', FALSE),
(2, 'object', TRUE),
(2, 'undefined', FALSE);

-- Q3 options (question_id = 3)
INSERT INTO options (question_id, option_text, is_correct) VALUES
(3, 'push()', TRUE),
(3, 'pop()', FALSE),
(3, 'shift()', FALSE),
(3, 'slice()', FALSE);

-- Q4 options (question_id = 4)
INSERT INTO options (question_id, option_text, is_correct) VALUES
(4, '6', FALSE),
(4, '"33"', TRUE),
(4, 'NaN', FALSE),
(4, 'undefined', FALSE);


-- Quiz 2: HTML & CSS
INSERT INTO quizzes (title, description, creator_id) VALUES
('HTML & CSS Fundamentals', 'A quiz covering the basics of HTML markup and CSS styling.', 1);

INSERT INTO questions (quiz_id, question_text) VALUES
(2, 'Which HTML tag is used to define an unordered list?'),
(2, 'Which CSS property controls the text size?'),
(2, 'Which attribute specifies an alternate text for an image?'),
(2, 'Which CSS property is used to change the background color?');

INSERT INTO options (question_id, option_text, is_correct) VALUES
(5, '<ol>', FALSE),
(5, '<ul>', TRUE),
(5, '<li>', FALSE),
(5, '<list>', FALSE);

INSERT INTO options (question_id, option_text, is_correct) VALUES
(6, 'font-style', FALSE),
(6, 'text-size', FALSE),
(6, 'font-size', TRUE),
(6, 'size', FALSE);

INSERT INTO options (question_id, option_text, is_correct) VALUES
(7, 'alt', TRUE),
(7, 'src', FALSE),
(7, 'title', FALSE),
(7, 'description', FALSE);

INSERT INTO options (question_id, option_text, is_correct) VALUES
(8, 'color', FALSE),
(8, 'bgcolor', FALSE),
(8, 'background-color', TRUE),
(8, 'background', FALSE);


-- Quiz 3: General Programming
INSERT INTO quizzes (title, description, creator_id) VALUES
('General Programming Concepts', 'Test your understanding of core programming concepts that apply across languages.', 1);

INSERT INTO questions (quiz_id, question_text) VALUES
(3, 'What is the time complexity of binary search on a sorted array?'),
(3, 'Which data structure uses LIFO (Last In First Out) ordering?'),
(3, 'What does "API" stand for?'),
(3, 'Which of the following is NOT a programming paradigm?');

INSERT INTO options (question_id, option_text, is_correct) VALUES
(9, 'O(n)', FALSE),
(9, 'O(log n)', TRUE),
(9, 'O(n^2)', FALSE),
(9, 'O(1)', FALSE);

INSERT INTO options (question_id, option_text, is_correct) VALUES
(10, 'Queue', FALSE),
(10, 'Stack', TRUE),
(10, 'Array', FALSE),
(10, 'Tree', FALSE);

INSERT INTO options (question_id, option_text, is_correct) VALUES
(11, 'Application Programming Interface', TRUE),
(11, 'Advanced Programming Instruction', FALSE),
(11, 'Automated Program Interaction', FALSE),
(11, 'Application Process Integration', FALSE);

INSERT INTO options (question_id, option_text, is_correct) VALUES
(12, 'Object-Oriented', FALSE),
(12, 'Functional', FALSE),
(12, 'Procedural', FALSE),
(12, 'Alphabetical', TRUE);


-- Quiz 4: Computer Science Basics
INSERT INTO quizzes (title, description, creator_id) VALUES
('Computer Science Basics', 'Fundamental computer science concepts every developer should know.', 1);

INSERT INTO questions (quiz_id, question_text) VALUES
(4, 'What does "CPU" stand for?'),
(4, 'Which number system is base 2?'),
(4, 'What is RAM primarily used for?'),
(4, 'Which of these is a compiled language rather than interpreted?');

INSERT INTO options (question_id, option_text, is_correct) VALUES
(13, 'Central Process Unit', FALSE),
(13, 'Central Processing Unit', TRUE),
(13, 'Computer Personal Unit', FALSE),
(13, 'Central Processor Utility', FALSE);

INSERT INTO options (question_id, option_text, is_correct) VALUES
(14, 'Decimal', FALSE),
(14, 'Hexadecimal', FALSE),
(14, 'Binary', TRUE),
(14, 'Octal', FALSE);

INSERT INTO options (question_id, option_text, is_correct) VALUES
(15, 'Long-term storage', FALSE),
(15, 'Temporary working memory', TRUE),
(15, 'Displaying graphics', FALSE),
(15, 'Cooling the CPU', FALSE);

INSERT INTO options (question_id, option_text, is_correct) VALUES
(16, 'Python', FALSE),
(16, 'JavaScript', FALSE),
(16, 'C', TRUE),
(16, 'PHP', FALSE);

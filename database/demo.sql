create database manga_management_system;


-- USERS

INSERT INTO users(username,email,password,role)
VALUES
    ('admin','[admin@test.com](mailto:admin@test.com)','123456','ADMIN'),
    ('editor1','[editor1@test.com](mailto:editor1@test.com)','123456','EDITOR'),
    ('artist1','[artist1@test.com](mailto:artist1@test.com)','123456','ARTIST'),
    ('reviewer1','[reviewer1@test.com](mailto:reviewer1@test.com)','123456','REVIEWER'),
    ('reader1','[reader1@test.com](mailto:reader1@test.com)','123456','USER');

-- PROJECTS

INSERT INTO manga_project(title,description,status)
VALUES
    ('Dragon Test','Demo Manga Project','IN_PROGRESS'),
    ('One Piece Demo','Adventure Project','PLANNING'),
    ('Naruto Demo','Completed Project','COMPLETED');

-- CHAPTERS

INSERT INTO chapter(chapter_number,title,status,project_id)
VALUES
    (1,'Chapter 1','DRAFT',1),
    (2,'Chapter 2','DRAFT',1),
    (3,'Chapter 3','PUBLISHED',1),
    (1,'Beginning','DRAFT',2),
    (2,'Journey','DRAFT',2),
    (3,'Battle','DRAFT',2),
    (1,'Ninja Start','PUBLISHED',3),
    (2,'Training','PUBLISHED',3),
    (3,'Exam','PUBLISHED',3),
    (4,'Final Battle','PUBLISHED',3);

-- WORKFLOW TASKS

INSERT INTO workflow_task(title,description,status)
VALUES
    ('Storyboard','Prepare storyboard','TODO'),
    ('Sketch','Draw sketch','TODO'),
    ('Line Art','Ink drawing','TODO'),
    ('Coloring','Apply colors','TODO'),
    ('Review','Review artwork','TODO'),
    ('Fix Errors','Correct mistakes','TODO'),
    ('Export','Prepare final export','TODO'),
    ('Upload','Upload files','TODO'),
    ('QA Check','Quality assurance','TODO'),
    ('Publish','Release chapter','TODO');

-- ASSETS

INSERT INTO asset(file_name,file_path,file_type)
VALUES
    ('page1.jpg','uploads/page1.jpg','IMAGE'),
    ('page2.jpg','uploads/page2.jpg','IMAGE'),
    ('page3.jpg','uploads/page3.jpg','IMAGE'),
    ('page4.jpg','uploads/page4.jpg','IMAGE'),
    ('page5.jpg','uploads/page5.jpg','IMAGE'),
    ('cover.jpg','uploads/cover.jpg','IMAGE');

-- COMMENTS

INSERT INTO comment(content)
VALUES
    ('Looks good'),
    ('Need revision'),
    ('Improve shading'),
    ('Approved'),
    ('Publish ready');

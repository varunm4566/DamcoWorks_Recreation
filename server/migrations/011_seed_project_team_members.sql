-- Migration 011: Seed project_team_members for Delivery modal
-- Inserts 3–5 team members per project that has a person_project_assignment

DO $$
DECLARE
  names TEXT[] := ARRAY[
    'Aarav Shah','Aditi Mishra','Akash Gupta','Anjali Verma','Ankit Kumar',
    'Arjun Nair','Ayush Sharma','Deepak Singh','Divya Rao','Gaurav Mehta',
    'Harshita Patel','Ishaan Joshi','Jatin Soni','Kavya Reddy','Kiran Bose',
    'Lokesh Tiwari','Madhuri Iyer','Manav Chopra','Meera Pillai','Mohit Saxena',
    'Nandini Pandey','Nikhil Agarwal','Pallavi Desai','Piyush Malhotra','Pooja Gupta',
    'Prateek Bhatia','Priya Yadav','Rahul Kapoor','Rajesh Nambiar','Ritu Bansal',
    'Rohan Mehrotra','Sakshi Tripathi','Sanchit Jain','Shruti Wadekar','Sneha Kumar',
    'Sooraj Menon','Subhash Thakur','Swati Goyal','Tanmay Bhatt','Uday Lal',
    'Vaishali Khatri','Vikram Raghunathan','Vinita Pal','Yash Bhandari','Zoya Ansari'
  ];
  titles TEXT[] := ARRAY[
    'Senior Software Engineer I','Senior Software Engineer II','Software Engineer I',
    'Software Engineer II','Lead Software Engineer','Principal Engineer',
    'QA Engineer I','QA Engineer II','Senior QA Engineer',
    'Business Analyst','Senior Business Analyst','Solutions Architect',
    'DevOps Engineer','Cloud Engineer','UI/UX Designer','Data Analyst'
  ];
  sow_roles TEXT[] := ARRAY[
    'Senior Software Engineer','Software Engineer','Lead Software Engineer',
    'QA Engineer','Senior QA Engineer','Business Analyst',
    'Solutions Architect','DevOps Engineer','UI/UX Designer','Data Analyst'
  ];
  pid INTEGER;
  num_members INTEGER;
  i INTEGER;
  name_idx INTEGER;
  proj RECORD;
BEGIN
  FOR proj IN
    SELECT DISTINCT p.id AS project_id, p.contract_start_date, p.contract_end_date
    FROM projects p
    WHERE EXISTS (
      SELECT 1 FROM person_project_assignments ppa WHERE ppa.project_id = p.id
    )
  LOOP
    -- 3 to 5 members per project
    num_members := 3 + (proj.project_id % 3);
    FOR i IN 1..num_members LOOP
      name_idx := 1 + ((proj.project_id * 7 + i * 13) % array_length(names, 1));
      INSERT INTO project_team_members (
        project_id, name, employee_id, role_title, contribution, sow_role,
        allocation_percent, billing_percent, duration_start, duration_end
      ) VALUES (
        proj.project_id,
        names[name_idx],
        'EMP' || LPAD((proj.project_id * 10 + i)::text, 5, '0'),
        titles[1 + ((proj.project_id + i * 3) % array_length(titles, 1))],
        sow_roles[1 + ((proj.project_id + i) % array_length(sow_roles, 1))],
        sow_roles[1 + ((proj.project_id + i * 2) % array_length(sow_roles, 1))],
        CASE (i % 4)
          WHEN 0 THEN 100
          WHEN 1 THEN 75
          WHEN 2 THEN 50
          ELSE 100
        END,
        CASE (i % 3)
          WHEN 0 THEN 100
          WHEN 1 THEN 80
          ELSE 60
        END,
        COALESCE(proj.contract_start_date, '2023-01-01'),
        COALESCE(proj.contract_end_date,   '2026-12-31')
      )
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;
END $$;

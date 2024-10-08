
create table venue (
  venue_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table publication (
  publication_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table link_elem (
  link_elem_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table text_elem (
  text_elem_id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table org (
  org_id SERIAL PRIMARY KEY,
  name TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table person (
  person_id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table contrib_type (
  contrib_type_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table contrib (
  contrib_id SERIAL PRIMARY KEY,
  
  contrib_type_id INT references contrib_type(contrib_type_id) NOT NULL,
  person_contrib_id INT references person(person_id),
  org_contrib_id INT references org(org_id),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table jcd_project (
  jcd_project_id SERIAL PRIMARY KEY,
  project_key TEXT NOT NULL UNIQUE,
  route TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  project_date TIMESTAMP NOT NULL,

  producer_id INT references contrib(contrib_id) NOT NULL,
  venue_id INT references venue(venue_id) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table credit (
  credit_id SERIAL PRIMARY KEY,
  
  jcd_project_id INT references jcd_project(jcd_project_id) NOT NULL,
  contrib_id INT references contrib(contrib_id) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table prod_credit (
  prod_credit_id SERIAL PRIMARY KEY,
  
  jcd_project_id INT references jcd_project(jcd_project_id) NOT NULL,
  contrib_id INT references contrib(contrib_id) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table description (
  description_id SERIAL PRIMARY KEY,

  jcd_project_id INT references jcd_project(jcd_project_id) NOT NULL,
  text_elem_id INT references text_elem(text_elem_id) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table press (
  press_id SERIAL PRIMARY KEY,

  jcd_project_id INT references jcd_project(jcd_project_id) NOT NULL,
  publication_id INT references publication(publication_id) NOT NULL,
  link_elem_id INT references link_elem(link_elem_id) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

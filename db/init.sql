
create type JCD_PROJECT_IMAGE_KIND AS ENUM('gallery', 'title');

create table person (
  person_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table org (
  org_id SERIAL PRIMARY KEY,
  name TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table description (
  description_id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table publication (
  publication_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table venue (
  venue_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table jcd_project (
  jcd_project_id SERIAL PRIMARY KEY,
  project_key TEXT NOT NULL UNIQUE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  route TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  project_date TIMESTAMP NOT NULL,

  venue_id INT references venue(venue_id) NOT NULL,
  description_id INT references description(description_id) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table credit (
  credit_id SERIAL PRIMARY KEY,
  
  jcd_project_id INT references jcd_project(jcd_project_id) NOT NULL,
  person_contrib_id INT references person(person_id),
  org_contrib_id INT references org(org_id),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table prod_credit (
  prod_credit_id SERIAL PRIMARY KEY,
  
  jcd_project_id INT references jcd_project(jcd_project_id) NOT NULL,
  person_contrib_id INT references person(person_id),
  org_contrib_id INT references org(org_id),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table producer (
  producer_id SERIAL PRIMARY KEY,

  jcd_project_id INT references jcd_project(jcd_project_id) NOT NULL,
  person_contrib_id INT references person(person_id),
  org_contrib_id INT references org(org_id),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table press (
  press_id SERIAL PRIMARY KEY,
  description TEXT,
  link_text TEXT NOT NULL,
  link_url TEXT NOT NULL,

  jcd_project_id INT references jcd_project(jcd_project_id) NOT NULL,
  publication_id INT references publication(publication_id) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table jcd_image (
  jcd_image_id SERIAL PRIMARY KEY,
  path TEXT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table jcd_project_image (
  jcd_project_image_id SERIAL PRIMARY KEY,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  kind JCD_PROJECT_IMAGE_KIND NOT NULL,

  jcd_project_id INT references jcd_project(jcd_project_id) NOT NULL,
  jcd_image_id INT references jcd_image(jcd_image_id) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* Sort Tables */

create table credit_sort (
  credit_sort_id SERIAL PRIMARY KEY,
  sort_order INT NOT NULL,

  credit_id INT references credit(credit_id) NOT NULL,
  jcd_project_id INT references jcd_project(jcd_project_id) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table prod_credit_sort (
  prod_credit_sort_id SERIAL PRIMARY KEY,
  sort_order INT NOT NULL,

  prod_credit_id INT references prod_credit(prod_credit_id) NOT NULL,
  jcd_project_id INT references jcd_project(jcd_project_id) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table producer_sort (
  producer_sort_id SERIAL PRIMARY KEY,
  sort_order INT NOT NULL,

  producer_id INT references producer(producer_id) NOT NULL,
  jcd_project_id INT references jcd_project(jcd_project_id) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table jcd_project_sort (
  jcd_project_sort_id SERIAL PRIMARY KEY,
  sort_order INT NOT NULL,
  
  jcd_project_id INT references jcd_project(jcd_project_id) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table jcd_project_image_sort (
  jcd_project_image_sort_id SERIAL PRIMARY KEY,
  sort_order INT NOT NULL,

  jcd_project_image_id INT references jcd_project_image(jcd_project_image_id) NOT NULL,
  jcd_project_id INT references jcd_project(jcd_project_id) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

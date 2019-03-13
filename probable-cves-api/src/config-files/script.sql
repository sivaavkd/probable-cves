create type probable_cves_ecosystem_enum as enum('maven', 'python', 'npm', 'golang');
create type probable_cves_cause_enum as enum('Issue', 'PR', 'Commit', 'Issue Comment','PR Comment','Commit Comment');
create type probable_cves_review_enum as enum('Not Reviewed', 'Reviewed - Probable CVE', 'Reviewed - Not a CVE', 'Not sure');

create table probable_cves (
id serial primary key, 
ecosystem probable_cves_ecosystem_enum NOT NULL,
repository  VARCHAR (50) NOT NULL,
repo_url  VARCHAR (500) NOT NULL,
package VARCHAR (500) NOT NULL, 
cause_type probable_cves_cause_enum NOT NULL,
issue_date DATE,
issue_url JSONB,
fixed_date DATE,
fixed_url JSONB,
commit_date DATE,
commit_url JSONB,
identified_date DATE,
identified_url JSONB,
files_changed JSONB,
review_status probable_cves_review_enum NOT NULL DEFAULT 'Not Reviewed',
reviewed_at TIMESTAMP DEFAULT NOW(),
reviewed_by VARCHAR(255),
cve_id VARCHAR(50),
cve_date DATE,
flagged_score VARCHAR(25) NOT NULL,
flagged_at TIMESTAMP NOT NULL DEFAULT NOW(), 
flagged_comments JSONB,
additional_info JSONB,
review_comments JSONB);

/*
16 columns need to be inserted while inserting from CSV file:
repository, ecosystem, repo_url, package, cause_type, issue_url, issue_date, fixed_url, fixed_date,  commit_url, commit_date, identified_url, identified_date, files_changed, flagged_score, flagged_at

Example import:
copy probable_cves (repository, ecosystem, repo_url, package, cause_type, issue_url, issue_date, fixed_url, fixed_date,  commit_url, commit_date, identified_url, identified_date, files_changed, flagged_score, flagged_at) FROM '/Users/sadhikar/Documents/Work/cve_test/backend/Test2.csv' DELIMITER ';' NULL as 'null';

Example insert statement:
INSERT INTO probable_cves (ecosystem, repository, repo_url, package, cause_type, commit_url, commit_date, flagged_score, flagged_at) 
VALUES ('golang', 'kubernetes/dns', 'https://github.com/kubernetes/dns', 'kubernetes/dns','Commit','["https://github.com/kubernetes/dns/commit/83379281bee93833a3aaa39c00c220bb78f7e21a"]', '10/14/2017', '80%', '2/20/2018');

*/

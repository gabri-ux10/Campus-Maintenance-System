create table if not exists service_domains (
    id bigint auto_increment primary key,
    domain_key varchar(40) not null unique,
    label varchar(80) not null,
    sort_order int not null default 0,
    created_at datetime(6) not null
);

create table if not exists request_types (
    id bigint auto_increment primary key,
    service_domain_id bigint not null,
    label varchar(120) not null,
    active boolean not null default true,
    sort_order int not null default 0,
    created_at datetime(6) not null,
    constraint fk_request_types_service_domain foreign key (service_domain_id) references service_domains (id),
    constraint uk_request_types_domain_label unique (service_domain_id, label)
);

create table if not exists support_categories (
    id bigint auto_increment primary key,
    label varchar(120) not null unique,
    active boolean not null default true,
    sort_order int not null default 0,
    created_at datetime(6) not null
);

alter table buildings add column sort_order int not null default 0;
alter table tickets add column building_id bigint null;
alter table tickets add column request_type_id bigint null;
alter table support_requests add column support_category_id bigint null;

update buildings
set sort_order = id
where sort_order = 0;

insert into service_domains (domain_key, label, sort_order, created_at)
values
    ('ELECTRICAL', 'Electrical', 0, current_timestamp()),
    ('PLUMBING', 'Plumbing', 1, current_timestamp()),
    ('HVAC', 'HVAC', 2, current_timestamp()),
    ('CLEANING', 'Cleaning', 3, current_timestamp()),
    ('IT', 'IT', 4, current_timestamp()),
    ('FURNITURE', 'Furniture', 5, current_timestamp()),
    ('STRUCTURAL', 'Structural', 6, current_timestamp()),
    ('SAFETY', 'Safety', 7, current_timestamp()),
    ('OTHER', 'Other', 8, current_timestamp());

insert into request_types (service_domain_id, label, active, sort_order, created_at)
select sd.id,
       case sd.domain_key
           when 'HVAC' then 'HVAC issue'
           when 'IT' then 'IT issue'
           when 'OTHER' then 'Other issue'
           else concat(sd.label, ' issue')
       end,
       true,
       0,
       current_timestamp()
from service_domains sd;

insert into support_categories (label, active, sort_order, created_at)
values
    ('Account Access', true, 0, current_timestamp()),
    ('Ticket Submission', true, 1, current_timestamp()),
    ('Status Updates', true, 2, current_timestamp()),
    ('Notifications', true, 3, current_timestamp()),
    ('Billing / Subscription', true, 4, current_timestamp()),
    ('Technical Bug', true, 5, current_timestamp()),
    ('Feature Request', true, 6, current_timestamp()),
    ('Other', true, 7, current_timestamp());

insert into buildings (name, code, floors, active, sort_order, created_at)
select missing.building_name,
       concat('AUTO-', cast(missing.row_num as char)),
       1,
       true,
       coalesce((select max(b.sort_order) from buildings b), -1) + missing.row_num,
       current_timestamp()
from (
    select distinct trim(t.building) as building_name,
           row_number() over (order by lower(trim(t.building))) as row_num
    from tickets t
    where t.building is not null
      and trim(t.building) <> ''
      and not exists (
          select 1
          from buildings b
          where lower(trim(b.name)) = lower(trim(t.building))
      )
) missing;

insert into support_categories (label, active, sort_order, created_at)
select missing.category_label,
       true,
       coalesce((select max(sc.sort_order) from support_categories sc), -1) + missing.row_num,
       current_timestamp()
from (
    select distinct trim(sr.category) as category_label,
           row_number() over (order by lower(trim(sr.category))) as row_num
    from support_requests sr
    where sr.category is not null
      and trim(sr.category) <> ''
      and not exists (
          select 1
          from support_categories sc
          where lower(trim(sc.label)) = lower(trim(sr.category))
      )
) missing;

update tickets t
set building_id = (
    select b.id
    from buildings b
    where lower(trim(b.name)) = lower(trim(t.building))
    order by b.id
    limit 1
)
where t.building_id is null
  and t.building is not null
  and trim(t.building) <> '';

update tickets t
set request_type_id = (
    select rt.id
    from request_types rt
    join service_domains sd on sd.id = rt.service_domain_id
    where sd.domain_key = t.category
    order by rt.sort_order asc, rt.id asc
    limit 1
)
where t.request_type_id is null
  and t.category is not null;

update tickets t
set request_type_id = (
    select rt.id
    from request_types rt
    join service_domains sd on sd.id = rt.service_domain_id
    where sd.domain_key = 'OTHER'
    order by rt.sort_order asc, rt.id asc
    limit 1
)
where t.request_type_id is null;

update support_requests sr
set support_category_id = (
    select sc.id
    from support_categories sc
    where lower(trim(sc.label)) = lower(trim(sr.category))
    order by sc.id
    limit 1
)
where sr.support_category_id is null
  and sr.category is not null
  and trim(sr.category) <> '';

update support_requests sr
set support_category_id = (
    select sc.id
    from support_categories sc
    where sc.label = 'Other'
    limit 1
)
where sr.support_category_id is null;

alter table tickets
    add constraint fk_tickets_building foreign key (building_id) references buildings (id);

alter table tickets
    add constraint fk_tickets_request_type foreign key (request_type_id) references request_types (id);

alter table support_requests
    add constraint fk_support_requests_support_category foreign key (support_category_id) references support_categories (id);

create index idx_tickets_building_id on tickets (building_id);
create index idx_tickets_request_type_id on tickets (request_type_id);
create index idx_support_requests_support_category_id on support_requests (support_category_id);

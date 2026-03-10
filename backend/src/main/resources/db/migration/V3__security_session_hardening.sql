create table if not exists auth_refresh_tokens (
    id bigint auto_increment primary key,
    user_id bigint not null,
    token_hash varchar(128) not null unique,
    token_family varchar(80) not null,
    expires_at datetime(6) not null,
    revoked_at datetime(6) null,
    rotated_at datetime(6) null,
    last_used_at datetime(6) null,
    replaced_by_token_hash varchar(128) null,
    ip_address varchar(64) null,
    user_agent varchar(255) null,
    created_at datetime(6) not null,
    constraint fk_auth_refresh_tokens_user foreign key (user_id) references users (id)
);

create table if not exists audit_events (
    id bigint auto_increment primary key,
    actor_user_id bigint null,
    actor_username varchar(80) null,
    actor_role varchar(20) null,
    action varchar(80) not null,
    target_type varchar(80) null,
    target_id varchar(120) null,
    ip_address varchar(64) null,
    user_agent varchar(255) null,
    details_json text null,
    created_at datetime(6) not null,
    constraint fk_audit_events_actor foreign key (actor_user_id) references users (id)
);

create index idx_auth_refresh_tokens_user_active on auth_refresh_tokens (user_id, revoked_at, expires_at);
create index idx_auth_refresh_tokens_family on auth_refresh_tokens (token_family);
create index idx_audit_events_action on audit_events (action, created_at);
create index idx_audit_events_actor on audit_events (actor_user_id, created_at);

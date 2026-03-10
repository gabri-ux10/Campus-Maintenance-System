create table if not exists users (
    id bigint auto_increment primary key,
    username varchar(50) not null unique,
    email varchar(120) not null unique,
    password_hash varchar(255) not null,
    role varchar(20) not null,
    full_name varchar(120) not null,
    email_verified boolean not null default false,
    token_version int not null default 0,
    created_at datetime(6) not null
);

create table if not exists buildings (
    id bigint auto_increment primary key,
    name varchar(100) not null unique,
    code varchar(20) not null unique,
    floors int not null,
    active boolean not null default true,
    created_at datetime(6) not null
);

create table if not exists support_requests (
    id bigint auto_increment primary key,
    full_name varchar(120) not null,
    email varchar(160) not null,
    category varchar(80) not null,
    subject varchar(180) not null,
    message text not null,
    created_at datetime(6) not null
);

create table if not exists tickets (
    id bigint auto_increment primary key,
    title varchar(150) not null,
    description text not null,
    category varchar(30) not null,
    building varchar(120) not null,
    location varchar(120) not null,
    urgency varchar(20) not null,
    status varchar(20) not null,
    created_by bigint not null,
    assigned_to bigint null,
    image_path varchar(255) null,
    after_image_path varchar(255) null,
    created_at datetime(6) not null,
    updated_at datetime(6) not null,
    resolved_at datetime(6) null,
    constraint fk_tickets_created_by foreign key (created_by) references users (id),
    constraint fk_tickets_assigned_to foreign key (assigned_to) references users (id)
);

create table if not exists ticket_logs (
    id bigint auto_increment primary key,
    ticket_id bigint not null,
    old_status varchar(20) null,
    new_status varchar(20) not null,
    changed_by bigint not null,
    note varchar(500) null,
    `timestamp` datetime(6) not null,
    constraint fk_ticket_logs_ticket foreign key (ticket_id) references tickets (id),
    constraint fk_ticket_logs_changed_by foreign key (changed_by) references users (id)
);

create table if not exists ticket_ratings (
    id bigint auto_increment primary key,
    ticket_id bigint not null unique,
    rated_by bigint not null,
    stars int not null,
    comment varchar(500) null,
    created_at datetime(6) not null,
    constraint fk_ticket_ratings_ticket foreign key (ticket_id) references tickets (id),
    constraint fk_ticket_ratings_rated_by foreign key (rated_by) references users (id)
);

create table if not exists ticket_comments (
    id bigint auto_increment primary key,
    ticket_id bigint not null,
    author_id bigint not null,
    content text not null,
    created_at datetime(6) not null,
    constraint fk_ticket_comments_ticket foreign key (ticket_id) references tickets (id),
    constraint fk_ticket_comments_author foreign key (author_id) references users (id)
);

create table if not exists notifications (
    id bigint auto_increment primary key,
    user_id bigint not null,
    title varchar(200) not null,
    message varchar(500) not null,
    type varchar(30) not null,
    is_read boolean not null default false,
    link_url varchar(255) null,
    created_at datetime(6) not null,
    constraint fk_notifications_user foreign key (user_id) references users (id)
);

create table if not exists announcements (
    id bigint auto_increment primary key,
    title varchar(200) not null,
    content text not null,
    active boolean not null default true,
    created_by bigint not null,
    created_at datetime(6) not null,
    constraint fk_announcements_created_by foreign key (created_by) references users (id)
);

create table if not exists chat_messages (
    id bigint auto_increment primary key,
    ticket_id bigint not null,
    sender_id bigint not null,
    content text not null,
    created_at datetime(6) not null,
    constraint fk_chat_messages_ticket foreign key (ticket_id) references tickets (id),
    constraint fk_chat_messages_sender foreign key (sender_id) references users (id)
);

create table if not exists staff_invites (
    id bigint auto_increment primary key,
    token_hash varchar(64) not null unique,
    username varchar(50) not null,
    email varchar(120) not null,
    full_name varchar(120) not null,
    invited_by bigint not null,
    expires_at datetime(6) not null,
    used boolean not null default false,
    accepted_at datetime(6) null,
    created_at datetime(6) not null,
    constraint fk_staff_invites_invited_by foreign key (invited_by) references users (id)
);

create table if not exists password_reset_tokens (
    id bigint auto_increment primary key,
    token varchar(64) not null unique,
    user_id bigint not null,
    expires_at datetime(6) not null,
    used boolean not null default false,
    created_at datetime(6) not null,
    constraint fk_password_reset_tokens_user foreign key (user_id) references users (id)
);

create table if not exists email_verification_tokens (
    id bigint auto_increment primary key,
    user_id bigint not null,
    code varchar(16) not null,
    expires_at datetime(6) not null,
    used boolean not null default false,
    attempt_count int not null default 0,
    created_at datetime(6) not null,
    constraint fk_email_verification_tokens_user foreign key (user_id) references users (id)
);

create table if not exists email_outbox (
    id bigint auto_increment primary key,
    to_email varchar(254) not null,
    subject varchar(200) not null,
    plain_text_body longtext not null,
    html_body longtext null,
    status varchar(20) not null,
    attempt_count int not null default 0,
    last_attempt_at datetime(6) null,
    next_attempt_at datetime(6) not null,
    sent_at datetime(6) null,
    last_error varchar(500) null,
    created_at datetime(6) not null
);

create table if not exists scheduled_broadcasts (
    id bigint auto_increment primary key,
    title varchar(200) not null,
    message varchar(5000) not null,
    audience varchar(20) not null,
    scheduled_for datetime(6) not null,
    status varchar(20) not null,
    created_by_id bigint not null,
    recipient_count int not null default 0,
    sent_at datetime(6) null,
    created_at datetime(6) not null,
    constraint fk_scheduled_broadcasts_created_by foreign key (created_by_id) references users (id)
);

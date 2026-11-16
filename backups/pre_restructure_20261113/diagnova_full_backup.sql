--
-- PostgreSQL database dump
--

\restrict PgMWaUxxZv9vq4uLPTGslcCaB25g7Aj3eOaaua41WnbL8Qhcgy7qwghSnA1b6uV

-- Dumped from database version 15.19
-- Dumped by pg_dump version 15.19

-- Started on 2026-11-13 22:14:32

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 877 (class 1247 OID 17063)
-- Name: gender; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.gender AS ENUM (
    'male',
    'female'
);


ALTER TYPE public.gender OWNER TO postgres;

--
-- TOC entry 859 (class 1247 OID 16422)
-- Name: institution_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.institution_type AS ENUM (
    'hospital',
    'clinical-lab',
    'pathology-center',
    'microbiology-center',
    'blood-bank',
    'other'
);


ALTER TYPE public.institution_type OWNER TO postgres;

--
-- TOC entry 931 (class 1247 OID 18172)
-- Name: lead_approval_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.lead_approval_status AS ENUM (
    'pending',
    'approved',
    'rejected'
);


ALTER TYPE public.lead_approval_status OWNER TO postgres;

--
-- TOC entry 856 (class 1247 OID 16412)
-- Name: lead_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.lead_status AS ENUM (
    'new',
    'contacted',
    'scheduled',
    'completed'
);


ALTER TYPE public.lead_status OWNER TO postgres;

--
-- TOC entry 880 (class 1247 OID 17068)
-- Name: order_priority; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_priority AS ENUM (
    'routine',
    'cito',
    'urgent'
);


ALTER TYPE public.order_priority OWNER TO postgres;

--
-- TOC entry 883 (class 1247 OID 17076)
-- Name: order_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_status AS ENUM (
    'ordered',
    'specimen_received',
    'processing',
    'partially_validated',
    'completed',
    'cancelled'
);


ALTER TYPE public.order_status OWNER TO postgres;

--
-- TOC entry 892 (class 1247 OID 17126)
-- Name: specimen_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.specimen_status AS ENUM (
    'collected',
    'received_in_lab',
    'processing',
    'archived',
    'rejected'
);


ALTER TYPE public.specimen_status OWNER TO postgres;

--
-- TOC entry 886 (class 1247 OID 17090)
-- Name: specimen_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.specimen_type AS ENUM (
    'whole_blood',
    'serum',
    'plasma',
    'urine',
    'csf',
    'stool',
    'swab',
    'other'
);


ALTER TYPE public.specimen_type OWNER TO postgres;

--
-- TOC entry 889 (class 1247 OID 17108)
-- Name: tube_color; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tube_color AS ENUM (
    'lavender_edta',
    'red_plain',
    'yellow_sst',
    'light_blue_citrate',
    'gray_fluoride',
    'green_heparin',
    'urine_container',
    'other'
);


ALTER TYPE public.tube_color OWNER TO postgres;

--
-- TOC entry 865 (class 1247 OID 16601)
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'super_admin',
    'sales_admin',
    'lab_staff',
    'pathologist',
    'demo_user'
);


ALTER TYPE public.user_role OWNER TO postgres;

--
-- TOC entry 868 (class 1247 OID 16610)
-- Name: user_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_status AS ENUM (
    'active',
    'inactive'
);


ALTER TYPE public.user_status OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 214 (class 1259 OID 16400)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16633)
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id text NOT NULL,
    user_id text,
    action character varying(100) NOT NULL,
    entity character varying(100) NOT NULL,
    record_id character varying(100),
    old_value jsonb,
    new_value jsonb,
    ip_address character varying(50),
    user_agent character varying(255),
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 18110)
-- Name: cms_comparison_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cms_comparison_items (
    id text NOT NULL,
    section_id text,
    number character varying(10) NOT NULL,
    conventional_title_id text NOT NULL,
    conventional_title_en text NOT NULL,
    conventional_desc_id text NOT NULL,
    conventional_desc_en text NOT NULL,
    diagnova_title_id text NOT NULL,
    diagnova_title_en text NOT NULL,
    diagnova_desc_id text NOT NULL,
    diagnova_desc_en text NOT NULL,
    impact_metric character varying(100) NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.cms_comparison_items OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 18100)
-- Name: cms_hero_slides; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cms_hero_slides (
    id text NOT NULL,
    section_id text,
    title_id text NOT NULL,
    title_en text NOT NULL,
    subtitle_id text,
    subtitle_en text,
    badge_id text,
    badge_en text,
    cta_primary_text_id text,
    cta_primary_text_en text,
    cta_primary_url text,
    cta_secondary_text_id text,
    cta_secondary_text_en text,
    cta_secondary_url text,
    image_url text NOT NULL,
    image_alt text,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.cms_hero_slides OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 18132)
-- Name: cms_partners; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cms_partners (
    id text NOT NULL,
    section_id text,
    name character varying(120) NOT NULL,
    logo_url text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.cms_partners OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 18091)
-- Name: cms_sections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cms_sections (
    id text NOT NULL,
    section_key character varying(50) NOT NULL,
    badge_id text,
    badge_en text,
    title_id text,
    title_en text,
    subtitle_id text,
    subtitle_en text,
    extra_content jsonb,
    is_published boolean DEFAULT true NOT NULL,
    updated_by character varying(100),
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.cms_sections OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 18120)
-- Name: cms_testimonials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cms_testimonials (
    id text NOT NULL,
    section_id text,
    name character varying(120) NOT NULL,
    role_id_text character varying(120) NOT NULL,
    role_en_text character varying(120),
    institution character varying(150) NOT NULL,
    quote_id text NOT NULL,
    quote_en text NOT NULL,
    avatar_url text DEFAULT '/images/testimonial-silhouette-female.jpg'::text NOT NULL,
    rating integer DEFAULT 5 NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.cms_testimonials OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 18183)
-- Name: demo_magic_links; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.demo_magic_links (
    id text NOT NULL,
    token_hash character varying(128) NOT NULL,
    email character varying(255) NOT NULL,
    lead_id text NOT NULL,
    user_id text,
    expires_at timestamp(3) without time zone NOT NULL,
    used_at timestamp(3) without time zone,
    ip_address character varying(50),
    user_agent character varying(255),
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.demo_magic_links OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 17176)
-- Name: lab_order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lab_order_items (
    id text NOT NULL,
    order_id text NOT NULL,
    test_catalog_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.lab_order_items OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 17165)
-- Name: lab_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lab_orders (
    id text NOT NULL,
    order_number character varying(50) NOT NULL,
    patient_id text NOT NULL,
    physician_id text,
    source_location character varying(100) NOT NULL,
    priority public.order_priority DEFAULT 'routine'::public.order_priority NOT NULL,
    clinical_notes text,
    status public.order_status DEFAULT 'ordered'::public.order_status NOT NULL,
    ordered_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.lab_orders OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16435)
-- Name: leads; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leads (
    id text NOT NULL,
    name character varying(100) NOT NULL,
    institution character varying(150) NOT NULL,
    "jobTitle" character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(30) NOT NULL,
    institution_type public.institution_type DEFAULT 'hospital'::public.institution_type NOT NULL,
    notes text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    user_id text,
    voucher_code character varying(50),
    voucher_expiry timestamp(3) without time zone,
    status integer DEFAULT 1 NOT NULL,
    demo_date timestamp(3) without time zone,
    approval_status public.lead_approval_status DEFAULT 'pending'::public.lead_approval_status NOT NULL,
    approved_at timestamp(3) without time zone,
    approved_by character varying(100),
    confirmed_demo_date timestamp(3) without time zone,
    demo_duration_days integer DEFAULT 3 NOT NULL,
    rejection_reason text,
    requested_demo_date timestamp(3) without time zone
);


ALTER TABLE public.leads OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 17137)
-- Name: patients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patients (
    id text NOT NULL,
    mrn character varying(50) NOT NULL,
    national_id character varying(30),
    name character varying(120) NOT NULL,
    birth_date timestamp(3) without time zone NOT NULL,
    sex public.gender NOT NULL,
    phone character varying(30),
    address text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.patients OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 17145)
-- Name: physicians; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.physicians (
    id text NOT NULL,
    external_code character varying(50) NOT NULL,
    name character varying(120) NOT NULL,
    specialization character varying(100) NOT NULL,
    department character varying(100) NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.physicians OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 18069)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id text NOT NULL,
    name character varying(50) NOT NULL,
    description character varying(255),
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 17184)
-- Name: specimens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.specimens (
    id text NOT NULL,
    barcode_number character varying(50) NOT NULL,
    order_id text NOT NULL,
    specimen_type public.specimen_type NOT NULL,
    tube_color public.tube_color NOT NULL,
    volume character varying(30) DEFAULT '3.0 mL'::character varying,
    collected_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    received_at timestamp(3) without time zone,
    status public.specimen_status DEFAULT 'collected'::public.specimen_status NOT NULL,
    rejection_reason text,
    rejected_by character varying(100),
    rejected_at timestamp(3) without time zone,
    received_by character varying(100),
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.specimens OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 17153)
-- Name: test_catalogs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.test_catalogs (
    id text NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(150) NOT NULL,
    category character varying(100) NOT NULL,
    specimen_type public.specimen_type DEFAULT 'whole_blood'::public.specimen_type NOT NULL,
    tube_color public.tube_color DEFAULT 'lavender_edta'::public.tube_color NOT NULL,
    unit character varying(30),
    tat_minutes integer DEFAULT 60 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.test_catalogs OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16615)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255),
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    institution character varying(150),
    job_title character varying(100),
    phone character varying(30),
    role_id text,
    status integer DEFAULT 1 NOT NULL,
    demo_activated_at timestamp(3) without time zone,
    demo_duration_days integer,
    demo_expires_at timestamp(3) without time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 3544 (class 0 OID 16400)
-- Dependencies: 214
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
0a8e772c-136b-4749-8e97-e11d35beb34b	b0f26189876e91b64fb7435474fef96d166465d3827bcb2e2746df93a81b36d8	2026-10-13 23:24:22.223999+07	20261013162422_init_leads	\N	\N	2026-10-13 23:24:22.083294+07	1
b92c2d82-44a9-4424-8029-9fcec07db3eb	69aee06d9d9e9078d4030cdef8c694d82e3f9471860cb2ef697e292f13d2e0a7	2026-10-16 09:23:06.004887+07	20261016022305_add_users_and_audit	\N	\N	2026-10-16 09:23:05.757521+07	1
016dad37-30ac-409b-847e-d92ac9098869	2eacc304ad4f6f1ded0d189b2276e7783638f9d11cdd82477854b2a0181ea4e8	2026-10-16 13:09:44.698285+07	20261016060944_add_lis_core_preanalytic	\N	\N	2026-10-16 13:09:44.319404+07	1
\.


--
-- TOC entry 3547 (class 0 OID 16633)
-- Dependencies: 217
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, user_id, action, entity, record_id, old_value, new_value, ip_address, user_agent, created_at) FROM stdin;
cmvajzkab000121jadv2ytjyn	cmvacj8hm0000b9szs4gwxapv	LOGIN_SUCCESS	User	cmvacj8hm0000b9szs4gwxapv	null	null	::1	Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.9444	2026-10-16 05:54:56.24
cmvajzrtv000321jatas9rasz	cmvacj8hm0000b9szs4gwxapv	LOGIN_SUCCESS	User	cmvacj8hm0000b9szs4gwxapv	null	null	::1	Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.9444	2026-10-16 05:55:06.019
cmvak4ky4000521jam3olrxu2	cmvacj8hm0000b9szs4gwxapv	LOGIN_SUCCESS	User	cmvacj8hm0000b9szs4gwxapv	null	null	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36	2026-10-16 05:58:50.38
cmvakcgex000821ja5afmr4fl	\N	CREATE_LEAD	Lead	cmvakcgdu000621jam9p79y5v	null	{"name": "artha", "email": "artaaazmuridbazma@gmail.com", "status": "new", "institution": "RSUD"}	\N	\N	2026-10-16 06:04:57.754
cmvake7h2000b21jakfsoqcdc	cmvacj8hm0000b9szs4gwxapv	UPDATE_LEAD_STATUS	Lead	cmvakcgdu000621jam9p79y5v	{"status": "new"}	{"note": null, "status": "new"}	\N	\N	2026-10-16 06:06:19.478
cmvaky30o0002c9b8wt98ehm1	\N	RECEIVE_SPECIMEN	Specimen	cmvakvsva000l4gvjthwoj598	{"status": "COLLECTED"}	{"status": "received_in_lab", "receivedAt": "2026-10-16T06:21:46.799Z", "receivedBy": "Petugas Lab"}	\N	\N	2026-10-16 06:21:46.824
cmval1lix0011c9b8g5q68esj	\N	CREATE_LAB_ORDER	LabOrder	cmval1liq000sc9b8kel6hwwb	null	{"barcodes": ["SP-261016-0003", "SP-261016-0004"], "priority": "urgent", "patientMrn": "RM-20261016-0005", "testsCount": 4, "orderNumber": "ORD-20261016-0002", "patientName": "Tn. Ahmad Dahlan", "specimensCount": 2}	\N	\N	2026-10-16 06:24:30.777
cmval1ubo0013c9b8f1tcl4qw	\N	REJECT_SPECIMEN	Specimen	cmval1liq000zc9b8hx87u18o	{"status": "COLLECTED"}	{"status": "rejected", "rejectedAt": "2026-10-16T06:24:42.174Z", "rejectedBy": "Analis Siti Nurhaliza, A.Md.AK", "rejectionReason": "Sampel lisis parah (derajat 3+), tidak layak untuk pemeriksaan fungsi hati dan glukosa."}	\N	\N	2026-10-16 06:24:42.18
cmvalistm000jshy5cr3bsulq	\N	CREATE_LAB_ORDER	LabOrder	cmvalist6000bshy543vd31lk	null	{"priority": "cito", "patientId": "cmval1lif000pc9b8kxyw2rrg", "itemsCount": 2, "tubesCount": 2, "orderNumber": "ORD-20261016-0003"}	\N	\N	2026-10-16 06:37:53.386
cmvalitgm000mshy5f8rz56y1	\N	RECEIVE_SPECIMEN	Specimen	cmvalistb000fshy5s862poib	{"status": "collected"}	{"status": "received_in_lab", "receivedAt": "2026-10-16T06:37:54.196Z", "receivedBy": "Petugas Lab", "barcodeNumber": "SP-261016-0005"}	\N	\N	2026-10-16 06:37:54.215
cmvaliu1r000oshy5oqmifhjy	\N	REJECT_SPECIMEN	Specimen	cmvaliste000hshy5e8rrsb5g	{"status": "collected"}	{"reason": "Sampel beku / clotted, minta pengambilan darah ulang", "status": "rejected", "rejectedAt": "2026-10-16T06:37:54.971Z", "rejectedBy": "Petugas Lab", "barcodeNumber": "SP-261016-0006"}	\N	\N	2026-10-16 06:37:54.975
cmvjvy2ba0001bnx1r5nq5nnw	cmvacj8hm0000b9szs4gwxapv	LOGIN_SUCCESS	User	cmvacj8hm0000b9szs4gwxapv	null	null	127.0.0.1	\N	2026-10-22 18:39:37.269
cmvjvz5cp0003bnx14w0nqsbv	cmvacj8hm0000b9szs4gwxapv	LOGIN_SUCCESS	User	cmvacj8hm0000b9szs4gwxapv	null	null	127.0.0.1	\N	2026-10-22 18:40:27.865
cmvjw4nnh0005bnx1v4tk48fc	cmvacj8hm0000b9szs4gwxapv	LOGIN_SUCCESS	User	cmvacj8hm0000b9szs4gwxapv	null	null	172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36 Edg/155.0.0.0	2026-10-22 18:44:44.861
cmvtico1o00023fvdzpoid2rd	\N	CREATE_LEAD	Lead	cmvticnyy00003fvdb4x8916n	null	{"name": "artha", "email": "artaaazmuridbazma@gmail.com", "status": "new", "institution": "RSUP"}	\N	\N	2026-10-29 12:16:45.754
cmvtieoi300053fvdujq1xmr3	\N	CREATE_LEAD	Lead	cmvtieohx00033fvdpxni9den	null	{"name": "artha", "email": "artaaazmuridbazma@gmail.com", "status": "new", "institution": "RSUP"}	\N	\N	2026-10-29 12:18:19.659
cmvtinsgp00073fvd915ztno1	cmvacj8hm0000b9szs4gwxapv	LOGIN_SUCCESS	User	cmvacj8hm0000b9szs4gwxapv	null	null	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	2026-10-29 12:25:24.697
cmvtitqa100093fvdsx8km56g	cmvacj8m40001b9sze7p82ws9	LOGIN_SUCCESS	User	cmvacj8m40001b9sze7p82ws9	null	null	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36	2026-10-29 12:30:01.801
cmvtiwj6y000e3fvduks87qgi	cmvacj8hm0000b9szs4gwxapv	UPDATE_LEAD_STATUS	Lead	cmvtieohx00033fvdpxni9den	{"status": "new"}	{"note": "oke", "status": "contacted"}	\N	\N	2026-10-29 12:32:12.586
cmvtj10p2000h3fvdt13uikrt	cmvacj8hm0000b9szs4gwxapv	UPDATE_LEAD_STATUS	Lead	cmvtieohx00033fvdpxni9den	{"status": "contacted"}	{"note": null, "status": "completed"}	\N	\N	2026-10-29 12:35:41.894
cmvtj1fhg000k3fvdfrva2kd8	cmvacj8hm0000b9szs4gwxapv	UPDATE_LEAD_STATUS	Lead	cmvtieohx00033fvdpxni9den	{"status": "completed"}	{"note": null, "status": "completed"}	\N	\N	2026-10-29 12:36:01.06
cmvzbsjxn0000e43wczyiswwv	cmvacj8hm0000b9szs4gwxapv	LOGIN_SUCCESS	User	cmvacj8hm0000b9szs4gwxapv	null	null	172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	2026-11-02 13:59:46.668
cmvzbv5bv0001e43wc6tsmixn	cmvacj8hm0000b9szs4gwxapv	LOGIN_SUCCESS	User	cmvacj8hm0000b9szs4gwxapv	null	null	172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-02 14:01:47.708
cmvzdsb5o0002e43wxkpa5s0q	cmvacj8hm0000b9szs4gwxapv	LOGIN_SUCCESS	User	cmvacj8hm0000b9szs4gwxapv	null	null	172.18.0.1	node	2026-11-02 14:55:34.521
cmvzdy38z00007o96xx3ax34t	cmvacj8hm0000b9szs4gwxapv	LOGIN_SUCCESS	User	cmvacj8hm0000b9szs4gwxapv	null	null	172.18.0.1	node	2026-11-02 15:00:04.211
cmvzdy52600017o96nhc5bug2	cmvacj8hm0000b9szs4gwxapv	UPDATE_CMS_SECTION	cms_sections	hero	{"id": "cmvzdaqwb000011hgsv3g745k", "badgeEn": "AI-Powered Laboratory Intelligence Platform", "badgeId": "Platform Intelijen Laboratorium Berbasis AI", "titleEn": "Next-Generation Laboratory Intelligence Platform", "titleId": "Platform Intelijen Laboratorium Terdepan", "createdAt": "2026-11-02T14:41:55.115Z", "updatedAt": "2026-11-02T14:41:55.115Z", "updatedBy": null, "sectionKey": "hero", "subtitleEn": "A next-generation Laboratory Information System autonomously connecting medical instruments with clinicians. Transforming complex diagnostic data into fast, accurate, and actionable medical decisions.", "subtitleId": "Sistem Informasi Laboratorium generasi baru yang menghubungkan instrumen medis secara otomatis dengan para klinisi. Mengubah data diagnostik kompleks menjadi keputusan medis yang cepat, akurat, dan transparan.", "isPublished": true, "extraContent": null}	{"id": "cmvzdaqwb000011hgsv3g745k", "badgeEn": "AI-Powered Laboratory Intelligence Platform", "badgeId": "Platform Intelijen Laboratorium Berbasis AI (Verified CMS)", "titleEn": "Next-Generation Laboratory Intelligence Platform", "titleId": "Platform Intelijen Laboratorium Terdepan", "createdAt": "2026-11-02T14:41:55.115Z", "updatedAt": "2026-11-02T15:00:06.551Z", "updatedBy": "cmvacj8hm0000b9szs4gwxapv", "sectionKey": "hero", "subtitleEn": "A next-generation Laboratory Information System autonomously connecting medical instruments with clinicians. Transforming complex diagnostic data into fast, accurate, and actionable medical decisions.", "subtitleId": "Sistem Informasi Laboratorium generasi baru yang menghubungkan instrumen medis secara otomatis dengan para klinisi. Mengubah data diagnostik kompleks menjadi keputusan medis yang cepat, akurat, dan transparan.", "isPublished": true, "extraContent": null}	\N	\N	2026-11-02 15:00:06.558
cmvzdydgm00027o962r6xp4em	cmvacj8hm0000b9szs4gwxapv	UPDATE_CMS_SECTION	cms_sections	hero	{"id": "cmvzdaqwb000011hgsv3g745k", "badgeEn": "AI-Powered Laboratory Intelligence Platform", "badgeId": "Platform Intelijen Laboratorium Berbasis AI (Verified CMS)", "titleEn": "Next-Generation Laboratory Intelligence Platform", "titleId": "Platform Intelijen Laboratorium Terdepan", "createdAt": "2026-11-02T14:41:55.115Z", "updatedAt": "2026-11-02T15:00:06.551Z", "updatedBy": "cmvacj8hm0000b9szs4gwxapv", "sectionKey": "hero", "subtitleEn": "A next-generation Laboratory Information System autonomously connecting medical instruments with clinicians. Transforming complex diagnostic data into fast, accurate, and actionable medical decisions.", "subtitleId": "Sistem Informasi Laboratorium generasi baru yang menghubungkan instrumen medis secara otomatis dengan para klinisi. Mengubah data diagnostik kompleks menjadi keputusan medis yang cepat, akurat, dan transparan.", "isPublished": true, "extraContent": null}	{"id": "cmvzdaqwb000011hgsv3g745k", "badgeEn": "AI-Powered Laboratory Intelligence Platform", "badgeId": "Platform Intelijen Laboratorium Berbasis AI", "titleEn": "Next-Generation Laboratory Intelligence Platform", "titleId": "Platform Intelijen Laboratorium Terdepan", "createdAt": "2026-11-02T14:41:55.115Z", "updatedAt": "2026-11-02T15:00:17.435Z", "updatedBy": "cmvacj8hm0000b9szs4gwxapv", "sectionKey": "hero", "subtitleEn": "A next-generation Laboratory Information System autonomously connecting medical instruments with clinicians. Transforming complex diagnostic data into fast, accurate, and actionable medical decisions.", "subtitleId": "Sistem Informasi Laboratorium generasi baru yang menghubungkan instrumen medis secara otomatis dengan para klinisi. Mengubah data diagnostik kompleks menjadi keputusan medis yang cepat, akurat, dan transparan.", "isPublished": true, "extraContent": null}	\N	\N	2026-11-02 15:00:17.446
cmw4gza9g0000775f1gq0jlkk	cmvacj8hm0000b9szs4gwxapv	LOGIN_SUCCESS	User	cmvacj8hm0000b9szs4gwxapv	null	null	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36 Edg/157.0.0.0	2026-11-06 04:23:49.682
cmw581cvf0002flmuvc5vkefx	cmvacj8hm0000b9szs4gwxapv	LOGIN_SUCCESS	User	cmvacj8hm0000b9szs4gwxapv	null	null	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36	2026-11-06 17:01:16.011
cmw9av3ez000013r4o0q3fx7b	cmvacj8hm0000b9szs4gwxapv	LOGIN_SUCCESS	User	cmvacj8hm0000b9szs4gwxapv	null	null	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36	2026-11-09 13:31:27.37
cmwagus1o0000stc6o105oni7	cmvacj8m40001b9sze7p82ws9	LOGIN_SUCCESS	User	cmvacj8m40001b9sze7p82ws9	null	null	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36 Edg/157.0.0.0	2026-11-10 09:06:56.507
cmwaicmhi0001stc6k7v9f4go	cmvacj8m40001b9sze7p82ws9	LOGOUT	User	cmvacj8m40001b9sze7p82ws9	null	null	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36 Edg/157.0.0.0	2026-11-10 09:48:48.727
cmwaicsfl0002stc6icw2g7p6	cmvacj8hm0000b9szs4gwxapv	LOGIN_SUCCESS	User	cmvacj8hm0000b9szs4gwxapv	null	null	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36 Edg/157.0.0.0	2026-11-10 09:48:56.433
cmwapym0c000ekdisxo4q7vs5	cmvacj8hm0000b9szs4gwxapv	LOGOUT	User	cmvacj8hm0000b9szs4gwxapv	null	null	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36 Edg/157.0.0.0	2026-11-10 13:21:51.853
cmwapyrp7000fkdisvak3o4j1	cmvacj8hm0000b9szs4gwxapv	LOGIN_SUCCESS	User	cmvacj8hm0000b9szs4gwxapv	null	null	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36 Edg/157.0.0.0	2026-11-10 13:21:59.227
cmwaq32ba000gkdis9ura5rj7	cmvacj8hm0000b9szs4gwxapv	DELETE_CMS_HERO_SLIDE	cms_hero_slides	cmvzdaqxg000611hgsc8oma0e	{"id": "cmvzdaqxg000611hgsc8oma0e", "badgeEn": "Precision AI Diagnostics", "badgeId": "Kecerdasan Buatan Terdepan", "titleEn": "Precision AI Diagnostics, Empowered Clinicians", "titleId": "Diagnostik AI Presisi, Memperkuat Tenaga Medis", "imageAlt": "Nova AI Clinical Decision Support", "imageUrl": "/images/hero-bg-3.webp", "isActive": true, "createdAt": "2026-11-02T14:41:55.156Z", "sectionId": "cmvzdaqwb000011hgsv3g745k", "sortOrder": 3, "updatedAt": "2026-11-02T14:41:55.156Z", "subtitleEn": "Nova AI flags critical deviations instantly, assisting clinicians in faster decision making.", "subtitleId": "Nova AI mendeteksi deviasi kritis seketika dan mendukung dokter mengambil keputusan klinis lebih cepat.", "ctaPrimaryUrl": "/request-demo", "ctaSecondaryUrl": "/modules", "ctaPrimaryTextEn": "Schedule Demo", "ctaPrimaryTextId": "Jadwalkan Demo", "ctaSecondaryTextEn": "Explore Modules", "ctaSecondaryTextId": "Jelajahi Modul"}	null	\N	\N	2026-11-10 13:25:19.606
cmwaq6v5x000hkdism64lxqsk	cmvacj8hm0000b9szs4gwxapv	UPDATE_CMS_COMPARISON_ITEM	cms_comparison_items	cmvzdaqzw000n11hg6gxzitow	{"id": "cmvzdaqzw000n11hg6gxzitow", "number": "01", "isActive": true, "createdAt": "2026-11-02T14:41:55.244Z", "sectionId": "cmvzdaqzl000l11hgu2nytawa", "sortOrder": 1, "updatedAt": "2026-11-02T14:41:55.244Z", "impactMetric": "0% Duplikasi", "diagnovaDescEn": "Automated synchronization with EHR, HIS, and SATUSEHAT without repetitive re-typing.", "diagnovaDescId": "Sinkronisasi otomatis dengan SIMRS, RME, dan terhubung resmi ke SATUSEHAT Kemenkes tanpa ketik ulang.", "diagnovaTitleEn": "Instant Bi-directional Bridging", "diagnovaTitleId": "Bridging Instan Dua Arah", "conventionalDescEn": "Duplicate data entry causes specimen misidentification and slows patient onboarding.", "conventionalDescId": "Entri ganda berulang memicu salah identifikasi spesimen dan membuang waktu klinis.", "conventionalTitleEn": "Isolated & Disconnected from EHR", "conventionalTitleId": "Silo & Terisolasi dari SIMRS"}	{"id": "cmvzdaqzw000n11hg6gxzitow", "number": "07", "isActive": true, "createdAt": "2026-11-02T14:41:55.244Z", "sectionId": "cmvzdaqzl000l11hgu2nytawa", "sortOrder": 1, "updatedAt": "2026-11-10T13:28:16.952Z", "impactMetric": "0% Duplikasi", "diagnovaDescEn": "Automated synchronization with EHR, HIS, and SATUSEHAT without repetitive re-typing.", "diagnovaDescId": "Sinkronisasi otomatis dengan SIMRS, RME, dan terhubung resmi ke SATUSEHAT Kemenkes tanpa ketik ulang.", "diagnovaTitleEn": "Instant Bi-directional Bridging", "diagnovaTitleId": "Bridging Instan Dua Arah", "conventionalDescEn": "Duplicate data entry causes specimen misidentification and slows patient onboarding.", "conventionalDescId": "Entri ganda berulang memicu salah identifikasi spesimen dan membuang waktu klinis.", "conventionalTitleEn": "Isolated & Disconnected from EHR", "conventionalTitleId": "Silo & Terisolasi dari SIMRS"}	\N	\N	2026-11-10 13:28:16.965
cmwaq7d04000ikdisr222bg68	cmvacj8hm0000b9szs4gwxapv	UPDATE_CMS_COMPARISON_ITEM	cms_comparison_items	cmvzdaqzw000n11hg6gxzitow	{"id": "cmvzdaqzw000n11hg6gxzitow", "number": "07", "isActive": true, "createdAt": "2026-11-02T14:41:55.244Z", "sectionId": "cmvzdaqzl000l11hgu2nytawa", "sortOrder": 1, "updatedAt": "2026-11-10T13:28:16.952Z", "impactMetric": "0% Duplikasi", "diagnovaDescEn": "Automated synchronization with EHR, HIS, and SATUSEHAT without repetitive re-typing.", "diagnovaDescId": "Sinkronisasi otomatis dengan SIMRS, RME, dan terhubung resmi ke SATUSEHAT Kemenkes tanpa ketik ulang.", "diagnovaTitleEn": "Instant Bi-directional Bridging", "diagnovaTitleId": "Bridging Instan Dua Arah", "conventionalDescEn": "Duplicate data entry causes specimen misidentification and slows patient onboarding.", "conventionalDescId": "Entri ganda berulang memicu salah identifikasi spesimen dan membuang waktu klinis.", "conventionalTitleEn": "Isolated & Disconnected from EHR", "conventionalTitleId": "Silo & Terisolasi dari SIMRS"}	{"id": "cmvzdaqzw000n11hg6gxzitow", "number": "01", "isActive": true, "createdAt": "2026-11-02T14:41:55.244Z", "sectionId": "cmvzdaqzl000l11hgu2nytawa", "sortOrder": 1, "updatedAt": "2026-11-10T13:28:40.077Z", "impactMetric": "0% Duplikasi", "diagnovaDescEn": "Automated synchronization with EHR, HIS, and SATUSEHAT without repetitive re-typing.", "diagnovaDescId": "Sinkronisasi otomatis dengan SIMRS, RME, dan terhubung resmi ke SATUSEHAT Kemenkes tanpa ketik ulang.", "diagnovaTitleEn": "Instant Bi-directional Bridging", "diagnovaTitleId": "Bridging Instan Dua Arah", "conventionalDescEn": "Duplicate data entry causes specimen misidentification and slows patient onboarding.", "conventionalDescId": "Entri ganda berulang memicu salah identifikasi spesimen dan membuang waktu klinis.", "conventionalTitleEn": "Isolated & Disconnected from EHR", "conventionalTitleId": "Silo & Terisolasi dari SIMRS"}	\N	\N	2026-11-10 13:28:40.084
\.


--
-- TOC entry 3557 (class 0 OID 18110)
-- Dependencies: 227
-- Data for Name: cms_comparison_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cms_comparison_items (id, section_id, number, conventional_title_id, conventional_title_en, conventional_desc_id, conventional_desc_en, diagnova_title_id, diagnova_title_en, diagnova_desc_id, diagnova_desc_en, impact_metric, sort_order, is_active, created_at, updated_at) FROM stdin;
cmvzdar01000p11hgqb5x4y2c	cmvzdaqzl000l11hgu2nytawa	02	Ketergantungan Input Manual	Heavy Manual Transcription	Pengetikan angka hasil secara manual lambat dan memperbesar risiko salah transkripsi.	Typing test values manually is slow and raises risk of transcript error.	Otomasi Interfacing Analyzer	Direct Analyzer Interfacing	Koneksi instrumen langsung dan verifikasi otomatis memangkas Turnaround Time (TAT) hingga 70%.	Direct device interfacing and automatic verification cuts Turnaround Time (TAT) by up to 70%.	TAT Turun 70%	2	t	2026-11-02 14:41:55.25	2026-11-02 14:41:55.25
cmvzdar04000r11hgq684wrql	cmvzdaqzl000l11hgu2nytawa	03	Koneksi Alat Sering Terputus	Fragile Serial Connections	Komunikasi alat serial rentan drop, memicu antrean sampel dan risiko data hilang.	Serial connections frequently disconnect, creating sample bottlenecks and data loss.	Smart Gateway Berketahanan 99.9%	Fault-Tolerant Smart Gateway	Protokol HL7/ASTM dengan buffer luring (offline buffer), data tetap aman saat jaringan rumah sakit terganggu.	HL7/ASTM protocol with offline buffer keeps records safe even during network outages.	Uptime 99.9%	3	t	2026-11-02 14:41:55.252	2026-11-02 14:41:55.252
cmvzdar07000t11hgizkqoke5	cmvzdaqzl000l11hgu2nytawa	04	Deteksi Nilai Kritis Pasif	Passive Critical Value Detection	Hasil abnormal lambat disadari dokter karena ketiadaan notifikasi otomatis seketika.	Abnormal values go unnoticed until manual review, delaying urgent treatment.	Alert Real-Time & Asisten Nova AI	Real-Time Alerts & Nova AI Engine	Peringatan dini nilai kritis dan delta check instan, membantu dokter merespons kegawatdaruratan lebih cepat.	Instant critical alerts and delta checks empower physicians to respond rapidly to emergencies.	Alert < 1 Detik	4	t	2026-11-02 14:41:55.255	2026-11-02 14:41:55.255
cmvzdar0a000v11hg0lss7nlb	cmvzdaqzl000l11hgu2nytawa	05	Jejak Audit Lemah & Rawan Celah	Weak Audit Trail & Compliance	Riwayat koreksi tidak terlacak rapi, menyulitkan akreditasi KARS dan ISO 15189.	Change history lacks cryptographic certainty, complicating accreditation audits.	Audit Trail Kriptografis Lengkap	Tamper-Proof Audit Trail	Setiap modifikasi hasil terekam dengan timestamp, identitas operator, dan nilai sebelumnya siap akreditasi.	Every edit logs operator identity, timestamp, and previous values, ready for ISO 15189.	ISO 15189 Ready	5	t	2026-11-02 14:41:55.258	2026-11-02 14:41:55.258
cmvzdar0d000x11hgbvgdzpy5	cmvzdaqzl000l11hgu2nytawa	06	Skalabilitas Terbatas & Server Lokal	Limited Scaling & Fragile On-Prem	Server lokal rentan rusak fisik, backup manual jarang dilakukan, dan sulit diekspansi.	Local servers are prone to hardware failure, manual backups, and rigid limits.	Arsitektur Cloud Hybrid Skalabel	Scalable Hybrid-Cloud Architecture	Mendukung multi-cabang tanpa batas dengan backup otomatis dan enkripsi data end-to-end.	Multi-branch scalability with automated geo-redundant backups and end-to-end encryption.	Multi-Branch Ready	6	t	2026-11-02 14:41:55.262	2026-11-02 14:41:55.262
cmvzdaqzw000n11hg6gxzitow	cmvzdaqzl000l11hgu2nytawa	01	Silo & Terisolasi dari SIMRS	Isolated & Disconnected from EHR	Entri ganda berulang memicu salah identifikasi spesimen dan membuang waktu klinis.	Duplicate data entry causes specimen misidentification and slows patient onboarding.	Bridging Instan Dua Arah	Instant Bi-directional Bridging	Sinkronisasi otomatis dengan SIMRS, RME, dan terhubung resmi ke SATUSEHAT Kemenkes tanpa ketik ulang.	Automated synchronization with EHR, HIS, and SATUSEHAT without repetitive re-typing.	0% Duplikasi	1	t	2026-11-02 14:41:55.244	2026-11-10 13:28:40.077
\.


--
-- TOC entry 3556 (class 0 OID 18100)
-- Dependencies: 226
-- Data for Name: cms_hero_slides; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cms_hero_slides (id, section_id, title_id, title_en, subtitle_id, subtitle_en, badge_id, badge_en, cta_primary_text_id, cta_primary_text_en, cta_primary_url, cta_secondary_text_id, cta_secondary_text_en, cta_secondary_url, image_url, image_alt, sort_order, is_active, created_at, updated_at) FROM stdin;
cmvzdaqx1000211hgp01ff5t8	cmvzdaqwb000011hgsv3g745k	Dari Hasil Uji Mentah Menjadi Keputusan Klinis	From Raw Lab Results To Clinical Intelligence	Sistem Informasi Laboratorium generasi baru yang menghubungkan instrumen medis secara otomatis dengan para klinisi.	A next-generation Laboratory Information System autonomously connecting medical instruments with clinicians.	Platform Intelijen Laboratorium Berbasis AI	AI-Powered Laboratory Intelligence Platform	Jadwalkan Demo	Schedule Demo	/request-demo	Jelajahi Modul	Explore Modules	/modules	/images/hero-bg-1.webp	Diagnova Laboratory Intelligence Specialist	1	t	2026-11-02 14:41:55.141	2026-11-02 14:41:55.141
cmvzdaqxa000411hgjjifz9vc	cmvzdaqwb000011hgsv3g745k	Laboratorium Terkoneksi, Tanpa Hambatan Data	Connected Laboratory, Zero Data Silos	Bridging instan dua arah dengan SATUSEHAT Kemenkes dan ratusan jenis analyzer rumah sakit.	Instant bi-directional bridging with SATUSEHAT and hundreds of hospital laboratory instruments.	Interoperabilitas Nasional	Seamless Interoperability	Jadwalkan Demo	Schedule Demo	/request-demo	Jelajahi Modul	Explore Modules	/modules	/images/hero-bg-2.webp	Diagnova Seamless Interoperability & Automation	2	t	2026-11-02 14:41:55.151	2026-11-02 14:41:55.151
\.


--
-- TOC entry 3559 (class 0 OID 18132)
-- Dependencies: 229
-- Data for Name: cms_partners; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cms_partners (id, section_id, name, logo_url, sort_order, is_active, created_at, updated_at) FROM stdin;
cmvzdaqy8000911hgkkczvh23	cmvzdaqxm000711hgfz6534bp	RS Hermina Group	/images/trust-logo.svg	1	t	2026-11-02 14:41:55.184	2026-11-02 14:41:55.184
cmvzdaqyj000b11hgppoxxld6	cmvzdaqxm000711hgfz6534bp	Siloam Hospitals	/images/trust-logo.svg	2	t	2026-11-02 14:41:55.196	2026-11-02 14:41:55.196
cmvzdaqyp000d11hg1pjj7su4	cmvzdaqxm000711hgfz6534bp	Mayapada Hospital	/images/trust-logo.svg	3	t	2026-11-02 14:41:55.202	2026-11-02 14:41:55.202
cmvzdaqyx000f11hgotfofmx9	cmvzdaqxm000711hgfz6534bp	Prodia Diagnostika	/images/trust-logo.svg	4	t	2026-11-02 14:41:55.209	2026-11-02 14:41:55.209
cmvzdaqz2000h11hgr5u1ncl4	cmvzdaqxm000711hgfz6534bp	Kimia Farma Lab	/images/trust-logo.svg	5	t	2026-11-02 14:41:55.215	2026-11-02 14:41:55.215
cmvzdaqz7000j11hg0o75iwkn	cmvzdaqxm000711hgfz6534bp	RSUD Tarakan	/images/trust-logo.svg	6	t	2026-11-02 14:41:55.219	2026-11-02 14:41:55.219
\.


--
-- TOC entry 3555 (class 0 OID 18091)
-- Dependencies: 225
-- Data for Name: cms_sections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cms_sections (id, section_key, badge_id, badge_en, title_id, title_en, subtitle_id, subtitle_en, extra_content, is_published, updated_by, created_at, updated_at) FROM stdin;
cmvzdaqxm000711hgfz6534bp	trusted_by	Kemitraan	Partnership	DIPERCAYA OLEH	TRUSTED BY	Dipercaya oleh 50+ Laboratorium Klinis & Rumah Sakit di Seluruh Indonesia	Trusted by 50+ Clinical Laboratories & Hospitals Across Indonesia	\N	t	\N	2026-11-02 14:41:55.162	2026-11-02 14:41:55.162
cmvzdaqzf000k11hgso0x9gie	about	Tentang Diagnova	About Diagnova	Di Diagnova, Kami Mengubah Data Diagnostik Menjadi Intelijen Klinis, Memperkuat Laboratorium Menghasilkan Keputusan Medis yang Presisi.	At Diagnova, We Transform Diagnostic Data Into Clinical Intelligence, Empowering Laboratories To Make Precise Medical Decisions.	Lebih dari sekadar LIS konvensional, Diagnova adalah ekosistem cerdas yang menghubungkan tenaga medis, instrumen laboratorium, dan alur kerja klinis. Kami membantu laboratorium modern melangkah dari sekadar mengelola data menuju penyajian wawasan klinis yang akurat dan dapat ditindaklanjuti.	More than a traditional LIS, Diagnova is an intelligent ecosystem connecting clinicians, instruments, and laboratory workflows. We empower modern laboratories to move beyond managing data to delivering clear, actionable clinical insights.	{"imageAlt": "Diagnova DNA Intelligence Structure", "imageUrl": "/images/dna-about.webp"}	t	\N	2026-11-02 14:41:55.227	2026-11-02 14:41:55.227
cmvzdaqzl000l11hgu2nytawa	comparison	Perbandingan LIS	LIS Comparison	Mengapa Memilih Diagnova?	Why Choose Diagnova?	Bandingkan hambatan LIS konvensional dengan lonjakan efisiensi dan akurasi klinis bersama ekosistem cerdas Diagnova.	Compare the constraints of legacy LIS against the surge in clinical efficiency and diagnostic accuracy powered by Diagnova.	{"diagnovaBadgeEn": "6 Diagnova Ecosystem Advantages", "diagnovaBadgeId": "6 Keunggulan Ekosistem Diagnova", "conventionalBadgeEn": "6 Legacy LIS Constraints", "conventionalBadgeId": "6 Keterbatasan LIS Konvensional"}	t	\N	2026-11-02 14:41:55.233	2026-11-02 14:41:55.233
cmvzdar0g000y11hgtge8987a	workflow	Alur Kerja Presisi	Precision Workflow	Otomatisasi Laboratorium End-to-End	End-to-End Laboratory Automation	Setiap tabung spesimen bergerak melalui ekosistem digital terintegrasi dari meja registrasi hingga laporan dokter.	Every specimen moves through a secure digital lifecycle from registration counter to clinical report.	{"steps": [{"id": "step-1", "number": "01", "titleEn": "Smart Specimen Intake & Barcoding", "titleId": "Penerimaan & Pelabelan Cerdas", "iconName": "qrcode", "shortTitleEn": "Specimen Intake", "shortTitleId": "Penerimaan Barcode", "descriptionEn": "Each sample tube receives a unique barcode, eliminating misidentification and lost specimens.", "descriptionId": "Setiap tabung spesimen menerima barcode unik, memastikan tidak ada sampel tertukar di laboratorium."}, {"id": "step-2", "number": "02", "titleEn": "Automated Instrument Interfacing", "titleId": "Verifikasi Otomatis", "iconName": "cpu", "shortTitleEn": "Analyzer Automation", "shortTitleId": "Otomasi Analyzer", "descriptionEn": "Raw test values flow directly from analyzers into the digital patient record without manual transcription.", "descriptionId": "Setelah diproses analyzer, Diagnova menyimpan seluruh angka hasil uji secara langsung tanpa ketik ulang manual."}, {"id": "step-3", "number": "03", "titleEn": "Early Warning & Delta Checks", "titleId": "Deteksi Dini & Pengecekan Delta", "iconName": "activity", "shortTitleEn": "Delta Check", "shortTitleId": "Delta Check", "descriptionEn": "Sudden parameter shifts trigger immediate real-time alerts for pathologists and attending doctors.", "descriptionId": "Jika terdeteksi nilai kritis atau deviasi drastis, sistem otomatis memicu peringatan seketika bagi dokter dan analis."}, {"id": "step-4", "number": "04", "titleEn": "Validated Clinical Authorization", "titleId": "Hasil Akurat Siap Rilis", "iconName": "check", "shortTitleEn": "Validation & Release", "shortTitleId": "Validasi & Rilis", "descriptionEn": "Signed reports synchronize instantly to the hospital EHR and outpatient patient portal.", "descriptionId": "Hasil laboratorium yang telah tervalidasi langsung terkirim ke dokter dan tersinkronisasi mulus ke RME rumah sakit."}]}	t	\N	2026-11-02 14:41:55.265	2026-11-02 14:41:55.265
cmvzdar0l000z11hgiz3wbg4k	infrastructure	Infrastruktur & Arsitektur	Infrastructure & Architecture	Dibangun untuk Keandalan Kelas Rumah Sakit	Engineered for Hospital-Grade Reliability	Arsitektur cloud native Diagnova dirancang dengan standar keamanan data medis tertinggi, integrasi instrumen tak terbatas, dan asisten AI terdepan.	Diagnova cloud-native architecture is built with the highest medical data standards, limitless analyzer integrations, and cutting-edge clinical AI.	{"cards": [{"id": "automation", "titleEn": "100% Automation", "titleId": "Otomatisasi 100%", "iconName": "automation", "descriptionEn": "Strict barcode identification and direct analyzer interfacing cut Turnaround Time (TAT) by up to 70% by eliminating manual data entry.", "descriptionId": "Identifikasi kode batang yang ketat dan koneksi alat dua arah memangkas Turnaround Time (TAT) hingga 70% dengan mengeliminasi entri data manual."}, {"id": "integration", "titleEn": "Seamless Integration", "titleId": "Integrasi Tanpa Hambatan", "iconName": "integration", "descriptionEn": "Natively bridges with HIS, EMR, and is SATUSEHAT ready. Universally compatible with over 500 medical instruments.", "descriptionId": "Terhubung secara asli dengan SIMRS, RME, dan siap SATUSEHAT. Kompatibel secara universal dengan lebih dari 500 instrumen medis."}, {"id": "nova-ai", "titleEn": "Nova AI Assistant", "titleId": "Asisten Nova AI", "iconName": "ai", "descriptionEn": "Nova AI detects patterns, provides early warnings, and simplifies complex numbers. Treatment decisions remain 100% with the doctor.", "descriptionId": "Nova AI mendeteksi pola, memberikan peringatan dini, dan menyederhanakan angka diagnostik kompleks. Keputusan medis tetap 100% di tangan dokter."}]}	t	\N	2026-11-02 14:41:55.269	2026-11-02 14:41:55.269
cmvzdar1d001911hgt4bv0phu	cta	Mulai Sekarang	Get Started	Transformasi Laboratorium Anda Bersama Diagnova	Transform Your Laboratory with Diagnova	Hadirkan keandalan tinggi, kecepatan analisis, dan presisi klinis bagi institusi kesehatan Anda hari ini.	Bring high reliability, speed, and precision to your healthcare institution today.	{"buttonTextEn": "Request Demo", "buttonTextId": "Minta Demo", "placeholderEn": "Enter your email address", "placeholderId": "Masukkan alamat email Anda"}	t	\N	2026-11-02 14:41:55.298	2026-11-02 14:41:55.298
cmvzdar0q001011hgiws1yx0e	testimonials	Testimoni Mitra	Partner Testimonials	Kisah Nyata dari Mitra Laboratorium Kami	Real Stories Shared by Our Customers	Dengarkan langsung dari kepala laboratorium, dokter patologi klinik, dan direktur rumah sakit yang mengandalkan Diagnova setiap hari untuk mempercepat TAT dan memastikan akurasi diagnostik.	Hear directly from laboratory directors, clinical pathologists, and hospital executives who rely on Diagnova daily to streamline turnaround times and ensure diagnostic precision.	{"readMoreLabelEn": "Read more", "readMoreLabelId": "Baca selengkapnya"}	f	\N	2026-11-02 14:41:55.275	2026-11-10 13:46:16.21
cmvzdaqwb000011hgsv3g745k	hero	Platform Intelijen Laboratorium Berbasis AI	AI-Powered Laboratory Intelligence Platform	Platform Intelijen Laboratorium Terdepan	Next-Generation Laboratory Intelligence Platform	Sistem Informasi Laboratorium generasi baru yang menghubungkan instrumen medis secara otomatis dengan para klinisi. Mengubah data diagnostik kompleks menjadi keputusan medis yang cepat, akurat, dan transparan.	A next-generation Laboratory Information System autonomously connecting medical instruments with clinicians. Transforming complex diagnostic data into fast, accurate, and actionable medical decisions.	\N	t	cmvacj8hm0000b9szs4gwxapv	2026-11-02 14:41:55.115	2026-11-02 15:00:17.435
\.


--
-- TOC entry 3558 (class 0 OID 18120)
-- Dependencies: 228
-- Data for Name: cms_testimonials; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cms_testimonials (id, section_id, name, role_id_text, role_en_text, institution, quote_id, quote_en, avatar_url, rating, sort_order, is_active, created_at, updated_at) FROM stdin;
cmvzdar15001411hgxe0ti49n	cmvzdar0q001011hgiws1yx0e	dr. Arif Kurniawan, MARS	Direktur Pelayanan Medis	Medical Services Director	Siloam Hospitals Network	Platform Diagnova sangat mudah diimplementasikan dan langsung memberikan dampak operasional. Dalam hitungan minggu, koordinasi antara dokter spesialis dan analis lab menjadi jauh lebih sinkron dan presisi.	Diagnova was exceptionally fast to deploy and delivered immediate operational impact. Within weeks, synchronization between attending specialists and laboratory analysts reached peak precision.	/images/testimonial-silhouette-male.jpg	5	2	t	2026-11-02 14:41:55.289	2026-11-02 14:41:55.289
cmvzdar18001611hg2j7sgdqf	cmvzdar0q001011hgiws1yx0e	Maya Indrawati, S.Tr.AK	Koordinator Analis Medis Shift	Lead Shift Medical Analyst	Laboratorium Diagnostika Utama	Bagi tim teknisi analis, antarmukanya luar biasa intuitif. Fitur auto-verification dan bridging SATUSEHAT bekerja di latar belakang tanpa lag, menghemat berjam-jam kerja setiap shift malam.	For medical analysts, the UI is remarkably intuitive. Auto-verification and SATUSEHAT bridging work seamlessly in the background without lag, saving countless hours on night shifts.	/images/testimonial-silhouette-female.jpg	5	3	t	2026-11-02 14:41:55.293	2026-11-02 14:41:55.293
cmvzdar1b001811hgqmyqxohe	cmvzdar0q001011hgiws1yx0e	dr. Budi Santoso, Sp.A	Dokter Spesialis Anak & Konsultan PICU	Pediatric Specialist & PICU Consultant	Mayapada Hospital	Hasil laboratorium CITO dan peringatan nilai kritis kini terkirim otomatis ke perangkat tablet saat visit pasien. Kecepatan ini sangat berharga dalam menyelamatkan pasien kegawatdaruratan anak.	STAT lab results and critical alerts now appear automatically on our mobile tablets during rounds. This speed is invaluable when treating urgent pediatric intensive care cases.	/images/testimonial-silhouette-male.jpg	5	4	t	2026-11-02 14:41:55.295	2026-11-02 14:41:55.295
cmvzdar0z001211hgwgfbkn3p	\N	dr. Rina Puspitasari, Sp.PK	Kepala Laboratorium Sentral	Head of Central Laboratory	RS Hermina Group	Integrasi dua arah Diagnova dengan analyzer otomatis memangkas waktu entri manual hingga 75%. Risiko tertukar sampel kini nol dengan verifikasi barcode cerdas dan alert delta check instan.	Diagnova's bi-directional analyzer interfacing eliminated 75% of manual entry time. Sample mix-ups dropped to zero thanks to intelligent barcode verification and immediate delta alerts.	/images/testimonial-silhouette-female.jpg	5	1	t	2026-11-02 14:41:55.284	2026-11-10 13:41:13.732
\.


--
-- TOC entry 3560 (class 0 OID 18183)
-- Dependencies: 230
-- Data for Name: demo_magic_links; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.demo_magic_links (id, token_hash, email, lead_id, user_id, expires_at, used_at, ip_address, user_agent, created_at) FROM stdin;
cmw5820gi0006flmuc1vh94aj	739285e5cbf8eff2f401727f15a43f6c16590834adef328be81722a1d9d6d7a2	erlangga.arta35@smk.belajar.id	cmw580p2l0001flmu9a99jelt	cmw5820g60004flmulwlegubi	2026-11-07 17:01:46.576	2026-11-06 17:01:55.03	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36	2026-11-06 17:01:46.579
cmw584zm5000aflmub5ap6h81	8c45ca91ccc8cdef7e09344972d7926c42be73c1d8e3d4f54749e346d1a56262	artaaazmuridbazma@gmail.com	cmvakcgdu000621jam9p79y5v	cmw584zly0008flmu4drkhvnv	2026-11-07 17:04:05.448	\N	\N	\N	2026-11-06 17:04:05.454
cmw586aa4000cflmub0fi2xgl	35a06bd1a422c563c28f5f5b31dc24db841993eb9ee4da8da7125b39a19b0464	artaaazmuridbazma@gmail.com	cmvakcgdu000621jam9p79y5v	cmw584zly0008flmu4drkhvnv	2026-11-07 17:05:05.93	\N	\N	\N	2026-11-06 17:05:05.932
cmw586cnj000eflmuwkk3vtp8	488a04c593b7c8ee0d668aed500b5cf3ed03ec054f7f752ae67f8758fec4b674	artaaazmuridbazma@gmail.com	cmvakcgdu000621jam9p79y5v	cmw584zly0008flmu4drkhvnv	2026-11-07 17:05:09.005	\N	\N	\N	2026-11-06 17:05:09.007
cmw586dsz000gflmul9sn5vge	1ed7ee759a3eced0ddc5d9330a15c42c754df402cd1ad61aedca6d8c67d22c4f	artaaazmuridbazma@gmail.com	cmvakcgdu000621jam9p79y5v	cmw584zly0008flmu4drkhvnv	2026-11-07 17:05:10.497	\N	\N	\N	2026-11-06 17:05:10.499
cmw586ekh000iflmu1rw6dwqq	f347d53bd5187c2b65b5af13d8a2ee263f3e9274da358a85b4db6204bb0f2b7d	artaaazmuridbazma@gmail.com	cmvakcgdu000621jam9p79y5v	cmw584zly0008flmu4drkhvnv	2026-11-07 17:05:11.488	\N	\N	\N	2026-11-06 17:05:11.49
cmw586f5i000kflmuqa8dlrh1	4e31831b15d8274b8c9bc4a50031e9904d56fd649316a82014468b7ce66d9a52	artaaazmuridbazma@gmail.com	cmvakcgdu000621jam9p79y5v	cmw584zly0008flmu4drkhvnv	2026-11-07 17:05:12.244	\N	\N	\N	2026-11-06 17:05:12.246
cmw9c1gr0000413r494qoa8hu	eaf69adc3790157e39aa9f49ddf2bf9874f775f38b29ef47c1f9a8803abc706f	erlangga.arta35@smk.belajar.id	cmw9c0z3p000213r4x02d85b5	cmw5820g60004flmulwlegubi	2026-11-10 14:04:24.2	\N	\N	\N	2026-11-09 14:04:24.204
cmwapml4s0005kdisrtbtplc7	090d95e5bfd0d3f771bb5f20f54e3b018e5a76e6a32b14691b03c534c71ac71e	artaaazmuridbazma@gmail.com	cmwaplt0l0003kdiscvd7w5m2	cmw584zly0008flmu4drkhvnv	2026-11-11 13:12:30.836	\N	\N	\N	2026-11-10 13:12:30.843
cmwapno2l0007kdis4hx80xd5	f85595c9b37be80bc192c210077080a0379267bc1a784c79a5c3e1067e0483a2	artaaazmuridbazma@gmail.com	cmwaplt0l0003kdiscvd7w5m2	cmw584zly0008flmu4drkhvnv	2026-11-11 13:13:21.306	\N	\N	\N	2026-11-10 13:13:21.309
cmwapqr02000bkdis6uwx4sjd	ab998d45f0e1bb9741ec4d40c845e0372152d0375767d713c3e6215f428f8185	artaaazmuridbazma@gmail.com	cmwapogbu0009kdis5bzi0ouc	cmw584zly0008flmu4drkhvnv	2026-11-11 13:15:45.071	\N	\N	\N	2026-11-10 13:15:45.074
cmwapqvw5000dkdis0wsknjqu	1e0ba48d5d755641fccd1527a355bd08546980e662c299e4c4e9054ec65315b0	artaaazmuridbazma@gmail.com	cmwapogbu0009kdis5bzi0ouc	cmw584zly0008flmu4drkhvnv	2026-11-11 13:15:51.411	\N	\N	\N	2026-11-10 13:15:51.413
\.


--
-- TOC entry 3552 (class 0 OID 17176)
-- Dependencies: 222
-- Data for Name: lab_order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lab_order_items (id, order_id, test_catalog_id, created_at) FROM stdin;
cmvakvsva000j4gvjvjvl8pnf	cmvakvsv9000h4gvj4giqvve1	cmvakvss400004gvjl9acvhj9	2026-10-16 06:20:00.358
cmvakvsva000k4gvjroo4jb96	cmvakvsv9000h4gvj4giqvve1	cmvakvstd00074gvjoa7jwejb	2026-10-16 06:20:00.358
cmval1liq000uc9b89p21e8cb	cmval1liq000sc9b8kel6hwwb	cmvakvss400004gvjl9acvhj9	2026-10-16 06:24:30.77
cmval1liq000vc9b8chxjo0hq	cmval1liq000sc9b8kel6hwwb	cmvakvssz00014gvjja6ucftx	2026-10-16 06:24:30.77
cmval1liq000wc9b885s861ox	cmval1liq000sc9b8kel6hwwb	cmvakvst500034gvj1w7d6fe5	2026-10-16 06:24:30.77
cmval1liq000xc9b8322qkxjo	cmval1liq000sc9b8kel6hwwb	cmvakvst700044gvj1nr72b61	2026-10-16 06:24:30.77
cmvalist8000cshy54pm4gczg	cmvalist6000bshy543vd31lk	cmvakvss400004gvjl9acvhj9	2026-10-16 06:37:53.372
cmvalist8000dshy56jtdqfab	cmvalist6000bshy543vd31lk	cmvakvssz00014gvjja6ucftx	2026-10-16 06:37:53.372
\.


--
-- TOC entry 3551 (class 0 OID 17165)
-- Dependencies: 221
-- Data for Name: lab_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lab_orders (id, order_number, patient_id, physician_id, source_location, priority, clinical_notes, status, ordered_at, created_at, updated_at) FROM stdin;
cmvakvsv9000h4gvj4giqvve1	ORD-20261016-0001	cmvakvsu2000e4gvj2quz5ly8	cmvakvstx000d4gvj27kncx4d	IGD - Bed 04	cito	Pasien lemas mendadak, aritmia suspek hipokalemia / anemia akut.	specimen_received	2026-10-16 06:20:00.358	2026-10-16 06:20:00.358	2026-10-16 06:21:46.815
cmval1liq000sc9b8kel6hwwb	ORD-20261016-0002	cmval1lif000pc9b8kxyw2rrg	\N	Poli Penyakit Dalam	urgent	Pemeriksaan fungsi hati dan gula darah rutin tahunan.	ordered	2026-10-16 06:24:30.77	2026-10-16 06:24:30.77	2026-10-16 06:24:30.77
cmvalist6000bshy543vd31lk	ORD-20261016-0003	cmval1lif000pc9b8kxyw2rrg	\N	IGD (Instalasi Gawat Darurat)	cito	Pasien demam tinggi 4 hari, susp. DHF + cek gula darah & urin	ordered	2026-10-16 06:37:53.37	2026-10-16 06:37:53.37	2026-10-16 06:37:53.37
\.


--
-- TOC entry 3545 (class 0 OID 16435)
-- Dependencies: 215
-- Data for Name: leads; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.leads (id, name, institution, "jobTitle", email, phone, institution_type, notes, created_at, updated_at, user_id, voucher_code, voucher_expiry, status, demo_date, approval_status, approved_at, approved_by, confirmed_demo_date, demo_duration_days, rejection_reason, requested_demo_date) FROM stdin;
cmwaplt0l0003kdiscvd7w5m2	lutpan	RSUD JAYAWIJAYA	IT	artaaazmuridbazma@gmail.com	088293657753	pathology-center	izin	2026-11-10 13:11:54.406	2026-11-10 13:13:21.316	cmw584zly0008flmu4drkhvnv	DGN-8YHJAX	2026-11-13 13:13:21.314	3	2026-11-10 13:11:00	approved	2026-11-10 13:13:21.314	Diagnova Super Admin	2026-11-10 13:11:00	3	\N	2026-11-10 13:11:00
cmvticnyy00003fvdb4x8916n	artha	RSUP	KEPALA LAB	artaaazmuridbazma@gmail.com	088293657753	clinical-lab	sakit	2026-10-29 12:16:45.654	2026-11-02 14:04:00.767	\N	DGN-7S4N2Z	2026-11-05 14:03:15.444	4	\N	pending	\N	\N	\N	3	\N	\N
cmvtieohx00033fvdpxni9den	artha	RSUP	kepala lab 	artaaazmuridbazma@gmail.com	088293657753	clinical-lab	sakit	2026-10-29 12:18:19.649	2026-11-02 14:05:51.538	\N	DGN-MMQZXM	2026-11-05 14:05:51.536	3	\N	pending	\N	\N	\N	3	\N	\N
cmwapogbu0009kdis5bzi0ouc	izat	RSUP	kepala lab	artaaazmuridbazma@gmail.com	088293657753	clinical-lab	izin	2026-11-10 13:13:57.931	2026-11-10 13:15:51.421	cmw584zly0008flmu4drkhvnv	DGN-GALRLQ	2026-11-17 13:15:51.419	3	2026-11-12 03:00:00	approved	2026-11-10 13:15:51.419	Diagnova Super Admin	2026-11-12 03:00:00	7	\N	2026-11-10 13:13:00
cmvakcgdu000621jam9p79y5v	artha	RSUD	IT	artaaazmuridbazma@gmail.com	088293657753	clinical-lab	Obat Insomnia	2026-10-16 06:04:57.713	2026-11-06 17:05:19.621	cmw584zly0008flmu4drkhvnv	DGN-ZJLDBZ	2026-11-09 17:05:12.248	4	\N	approved	2026-11-06 17:05:12.248	Diagnova Super Admin	\N	3	\N	\N
cmw580p2l0001flmu9a99jelt	ERLANGGA ARTA DWI CAHYA	RSUD	IT	erlangga.arta35@smk.belajar.id	088293657753	clinical-lab	ttr	2026-11-06 17:00:45.16	2026-11-09 13:38:00.001	cmw5820g60004flmulwlegubi	DGN-3JW5JM	2026-11-09 17:01:46.581	4	2026-11-16 17:00:00	approved	2026-11-06 17:01:46.581	Diagnova Super Admin	2026-11-16 17:00:00	3	\N	2026-11-16 17:00:00
cmw9c0z3p000213r4x02d85b5	ERLANGGA ARTA DWI CAHYA	RSUD	IR	erlangga.arta35@smk.belajar.id	085716590336	clinical-lab	izin	2026-11-09 14:04:01.33	2026-11-09 14:04:24.208	cmw5820g60004flmulwlegubi	DGN-6H5NET	2026-11-12 14:04:24.206	3	2026-11-09 14:03:00	approved	2026-11-09 14:04:24.206	Diagnova Super Admin	2026-11-09 14:03:00	3	\N	2026-11-09 14:03:00
cmwapjy5t0001kdisj5jjutz2	ARTHA GANTENG	RSUP	kepala lab	artaaazmuridbazma@gmail.com	088293657753	pathology-center	izin	2026-11-10 13:10:27.752	2026-11-10 13:10:27.752	cmw584zly0008flmu4drkhvnv	\N	\N	1	2026-11-11 04:10:00	pending	\N	\N	\N	3	\N	2026-11-11 04:10:00
\.


--
-- TOC entry 3548 (class 0 OID 17137)
-- Dependencies: 218
-- Data for Name: patients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.patients (id, mrn, national_id, name, birth_date, sex, phone, address, created_at, updated_at) FROM stdin;
cmvakvsu2000e4gvj2quz5ly8	RM-20261016-0001	3171012345670001	Tn. Budi Santoso	1981-05-14 00:00:00	male	081234567890	Jl. Sudirman No. 45, Jakarta Pusat	2026-10-16 06:20:00.315	2026-10-16 06:20:00.315
cmvakvsuk000f4gvjbev2cylu	RM-20261016-0002	3171019876540002	Ny. Siti Rahmawati	1988-11-20 00:00:00	female	081987654321	Jl. Melati No. 12, Kebayoran Baru, Jakarta Selatan	2026-10-16 06:20:00.333	2026-10-16 06:20:00.333
cmvakzmhi0003c9b8pm1nzg4t	RM-20261016-0003	\N	Tn. Ahmad Dahlan	1975-08-17 00:00:00	male	081311223344	Jl. Diponegoro No. 8, Jakarta	2026-10-16 06:22:58.71	2026-10-16 06:22:58.71
cmval0do6000ec9b8w2l9goav	RM-20261016-0004	\N	Tn. Ahmad Dahlan	1975-08-17 00:00:00	male	081311223344	Jl. Diponegoro No. 8, Jakarta	2026-10-16 06:23:33.942	2026-10-16 06:23:33.942
cmval1lif000pc9b8kxyw2rrg	RM-20261016-0005	\N	Tn. Ahmad Dahlan	1975-08-17 00:00:00	male	081311223344	Jl. Diponegoro No. 8, Jakarta	2026-10-16 06:24:30.759	2026-10-16 06:24:30.759
\.


--
-- TOC entry 3549 (class 0 OID 17145)
-- Dependencies: 219
-- Data for Name: physicians; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.physicians (id, external_code, name, specialization, department, created_at, updated_at) FROM stdin;
cmvakvstn000b4gvjk9fgd4zu	DOC-SPPK-01	dr. Hendra Wijaya, Sp.PK	Patologi Klinik	Laboratorium Sentral	2026-10-16 06:20:00.299	2026-10-16 06:20:00.299
cmvakvstu000c4gvjcabcd4ww	DOC-SPPD-01	dr. Rina Kartika, Sp.PD	Penyakit Dalam	Poli Penyakit Dalam	2026-10-16 06:20:00.306	2026-10-16 06:20:00.306
cmvakvstx000d4gvj27kncx4d	DOC-IGD-01	dr. Dimas Prasetyo	Dokter Umum	Instalasi Gawat Darurat (IGD)	2026-10-16 06:20:00.309	2026-10-16 06:20:00.309
\.


--
-- TOC entry 3554 (class 0 OID 18069)
-- Dependencies: 224
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name, description, created_at) FROM stdin;
cmvzb2o270000fjvcnmb8tmeh	Super Admin	Akses penuh seluruh sistem Diagnova LIS	2026-11-02 13:39:38.959
cmvzb2o2o0001fjvczal6ggph	Sales Admin	Kelola permohonan demo & calon klien lab	2026-11-02 13:39:38.977
cmvzb2o2s0002fjvc14qlhkfn	Lab Staff	Petugas analis laboratorium & pre-analitik	2026-11-02 13:39:38.98
cmvzb2o2w0003fjvc3wluw8sz	Pathologist	Dokter Sp.PK untuk otorisasi klinis	2026-11-02 13:39:38.984
cmw55r9vr0000iro14lro2sy9	Demo User	Akses terbatas untuk akun uji coba / demo LIS	2026-11-06 15:57:26.343
\.


--
-- TOC entry 3553 (class 0 OID 17184)
-- Dependencies: 223
-- Data for Name: specimens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.specimens (id, barcode_number, order_id, specimen_type, tube_color, volume, collected_at, received_at, status, rejection_reason, rejected_by, rejected_at, received_by, created_at, updated_at) FROM stdin;
cmvakvsva000m4gvj54rm1vfg	SP-261016-0002	cmvakvsv9000h4gvj4giqvve1	serum	red_plain	4.0 mL	2026-10-16 06:20:00.358	\N	collected	\N	\N	\N	\N	2026-10-16 06:20:00.358	2026-10-16 06:20:00.358
cmvakvsva000l4gvjthwoj598	SP-261016-0001	cmvakvsv9000h4gvj4giqvve1	whole_blood	lavender_edta	3.0 mL	2026-10-16 06:20:00.358	2026-10-16 06:21:46.799	received_in_lab	\N	\N	\N	Petugas Lab	2026-10-16 06:20:00.358	2026-10-16 06:21:46.809
cmval1liq000yc9b8x1vpj4sg	SP-261016-0003	cmval1liq000sc9b8kel6hwwb	whole_blood	lavender_edta	3.0 mL	2026-10-16 06:24:30.77	\N	collected	\N	\N	\N	\N	2026-10-16 06:24:30.77	2026-10-16 06:24:30.77
cmval1liq000zc9b8hx87u18o	SP-261016-0004	cmval1liq000sc9b8kel6hwwb	serum	yellow_sst	3.0 mL	2026-10-16 06:24:30.77	\N	rejected	Sampel lisis parah (derajat 3+), tidak layak untuk pemeriksaan fungsi hati dan glukosa.	Analis Siti Nurhaliza, A.Md.AK	2026-10-16 06:24:42.174	\N	2026-10-16 06:24:30.77	2026-10-16 06:24:42.176
cmvalistb000fshy5s862poib	SP-261016-0005	cmvalist6000bshy543vd31lk	whole_blood	lavender_edta	3.0 mL	2026-10-16 06:37:53.374	2026-10-16 06:37:54.196	received_in_lab	\N	\N	\N	Petugas Lab	2026-10-16 06:37:53.375	2026-10-16 06:37:54.199
cmvaliste000hshy5e8rrsb5g	SP-261016-0006	cmvalist6000bshy543vd31lk	serum	yellow_sst	3.0 mL	2026-10-16 06:37:53.377	\N	rejected	Sampel beku / clotted, minta pengambilan darah ulang	Petugas Lab	2026-10-16 06:37:54.971	\N	2026-10-16 06:37:53.379	2026-10-16 06:37:54.972
\.


--
-- TOC entry 3550 (class 0 OID 17153)
-- Dependencies: 220
-- Data for Name: test_catalogs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.test_catalogs (id, code, name, category, specimen_type, tube_color, unit, tat_minutes, is_active, created_at, updated_at) FROM stdin;
cmvakvss400004gvjl9acvhj9	HEMA_CBC	Darah Lengkap / CBC (Hematologi)	Hematologi	whole_blood	lavender_edta	10^3/uL	45	t	2026-10-16 06:20:00.244	2026-10-16 06:20:00.244
cmvakvssz00014gvjja6ucftx	GLU_FASTING	Glukosa Darah Puasa (GDP)	Kimia Klinik	serum	yellow_sst	mg/dL	45	t	2026-10-16 06:20:00.276	2026-10-16 06:20:00.276
cmvakvst300024gvjzsopzzb1	LIPID_CHOL	Kolesterol Total	Kimia Klinik	serum	yellow_sst	mg/dL	60	t	2026-10-16 06:20:00.279	2026-10-16 06:20:00.279
cmvakvst500034gvj1w7d6fe5	LIV_SGOT	SGOT / AST (Fungsi Hati)	Kimia Klinik	serum	yellow_sst	U/L	60	t	2026-10-16 06:20:00.281	2026-10-16 06:20:00.281
cmvakvst700044gvj1nr72b61	LIV_SGPT	SGPT / ALT (Fungsi Hati)	Kimia Klinik	serum	yellow_sst	U/L	60	t	2026-10-16 06:20:00.283	2026-10-16 06:20:00.283
cmvakvst800054gvj3oa9z27t	REN_UREA	Ureum Darah	Fungsi Ginjal	serum	yellow_sst	mg/dL	60	t	2026-10-16 06:20:00.285	2026-10-16 06:20:00.285
cmvakvsta00064gvj15ilqy1g	REN_CREAT	Kreatinin Darah	Fungsi Ginjal	serum	yellow_sst	mg/dL	60	t	2026-10-16 06:20:00.287	2026-10-16 06:20:00.287
cmvakvstd00074gvjoa7jwejb	ELEC_POTASS	Kalium Darah (K+)	Elektrolit	serum	red_plain	mmol/L	30	t	2026-10-16 06:20:00.29	2026-10-16 06:20:00.29
cmvakvstg00084gvj56zhrim0	ELEC_SODIUM	Natrium Darah (Na+)	Elektrolit	serum	red_plain	mmol/L	30	t	2026-10-16 06:20:00.292	2026-10-16 06:20:00.292
cmvakvsti00094gvjpec9e16f	ELEC_CHLOR	Klorida Darah (Cl-)	Elektrolit	serum	red_plain	mmol/L	30	t	2026-10-16 06:20:00.294	2026-10-16 06:20:00.294
cmvakvstk000a4gvjozfjo28s	URIN_ROUTINE	Urinalisis Rutin Lengkap	Urinalisis	urine	urine_container	\N	30	t	2026-10-16 06:20:00.297	2026-10-16 06:20:00.297
\.


--
-- TOC entry 3546 (class 0 OID 16615)
-- Dependencies: 216
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password_hash, created_at, updated_at, institution, job_title, phone, role_id, status, demo_activated_at, demo_duration_days, demo_expires_at) FROM stdin;
cmvacj8hm0000b9szs4gwxapv	Diagnova Super Admin	admin@diagnova.id	$2b$10$2LieqoSH1BaHsqhipvLPlOrl.KD1ZpHFLMuCrsFoOaEH0d3GRbWBu	2026-10-16 02:26:17.147	2026-11-02 13:39:39.094	\N	\N	\N	cmvzb2o270000fjvcnmb8tmeh	1	\N	\N	\N
cmvacj8m40001b9sze7p82ws9	Diagnova Lead Specialist	sales@diagnova.id	$2b$10$NDmz.oFAvdG.0KikGtig..WoFK5YD3A/sYXy0N1TlfcoobXYMwnKK	2026-10-16 02:26:17.308	2026-11-02 13:39:39.207	\N	\N	\N	cmvzb2o2o0001fjvczal6ggph	1	\N	\N	\N
cmw5820g60004flmulwlegubi	ERLANGGA ARTA DWI CAHYA	erlangga.arta35@smk.belajar.id	\N	2026-11-06 17:01:46.566	2026-11-09 14:04:24.194	RSUD	IT	088293657753	cmw55r9vr0000iro14lro2sy9	1	2026-11-06 17:01:55.03	3	2026-11-09 17:01:55.03
cmw584zly0008flmu4drkhvnv	artha	artaaazmuridbazma@gmail.com	\N	2026-11-06 17:04:05.446	2026-11-10 13:15:51.403	RSUD	IT	088293657753	cmw55r9vr0000iro14lro2sy9	1	\N	7	\N
\.


--
-- TOC entry 3314 (class 2606 OID 16408)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3328 (class 2606 OID 16640)
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 3372 (class 2606 OID 18119)
-- Name: cms_comparison_items cms_comparison_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cms_comparison_items
    ADD CONSTRAINT cms_comparison_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3368 (class 2606 OID 18109)
-- Name: cms_hero_slides cms_hero_slides_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cms_hero_slides
    ADD CONSTRAINT cms_hero_slides_pkey PRIMARY KEY (id);


--
-- TOC entry 3380 (class 2606 OID 18141)
-- Name: cms_partners cms_partners_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cms_partners
    ADD CONSTRAINT cms_partners_pkey PRIMARY KEY (id);


--
-- TOC entry 3365 (class 2606 OID 18099)
-- Name: cms_sections cms_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cms_sections
    ADD CONSTRAINT cms_sections_pkey PRIMARY KEY (id);


--
-- TOC entry 3376 (class 2606 OID 18131)
-- Name: cms_testimonials cms_testimonials_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cms_testimonials
    ADD CONSTRAINT cms_testimonials_pkey PRIMARY KEY (id);


--
-- TOC entry 3386 (class 2606 OID 18190)
-- Name: demo_magic_links demo_magic_links_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demo_magic_links
    ADD CONSTRAINT demo_magic_links_pkey PRIMARY KEY (id);


--
-- TOC entry 3353 (class 2606 OID 17183)
-- Name: lab_order_items lab_order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_order_items
    ADD CONSTRAINT lab_order_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3348 (class 2606 OID 17175)
-- Name: lab_orders lab_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_orders
    ADD CONSTRAINT lab_orders_pkey PRIMARY KEY (id);


--
-- TOC entry 3319 (class 2606 OID 16444)
-- Name: leads leads_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_pkey PRIMARY KEY (id);


--
-- TOC entry 3335 (class 2606 OID 17144)
-- Name: patients patients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_pkey PRIMARY KEY (id);


--
-- TOC entry 3338 (class 2606 OID 17152)
-- Name: physicians physicians_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.physicians
    ADD CONSTRAINT physicians_pkey PRIMARY KEY (id);


--
-- TOC entry 3363 (class 2606 OID 18076)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 3359 (class 2606 OID 17194)
-- Name: specimens specimens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.specimens
    ADD CONSTRAINT specimens_pkey PRIMARY KEY (id);


--
-- TOC entry 3342 (class 2606 OID 17164)
-- Name: test_catalogs test_catalogs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_catalogs
    ADD CONSTRAINT test_catalogs_pkey PRIMARY KEY (id);


--
-- TOC entry 3324 (class 2606 OID 16624)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3325 (class 1259 OID 16646)
-- Name: audit_logs_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX audit_logs_created_at_idx ON public.audit_logs USING btree (created_at);


--
-- TOC entry 3326 (class 1259 OID 16645)
-- Name: audit_logs_entity_record_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX audit_logs_entity_record_id_idx ON public.audit_logs USING btree (entity, record_id);


--
-- TOC entry 3329 (class 1259 OID 16644)
-- Name: audit_logs_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX audit_logs_user_id_idx ON public.audit_logs USING btree (user_id);


--
-- TOC entry 3373 (class 1259 OID 18145)
-- Name: cms_comparison_items_section_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX cms_comparison_items_section_id_idx ON public.cms_comparison_items USING btree (section_id);


--
-- TOC entry 3374 (class 1259 OID 18146)
-- Name: cms_comparison_items_sort_order_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX cms_comparison_items_sort_order_idx ON public.cms_comparison_items USING btree (sort_order);


--
-- TOC entry 3369 (class 1259 OID 18143)
-- Name: cms_hero_slides_section_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX cms_hero_slides_section_id_idx ON public.cms_hero_slides USING btree (section_id);


--
-- TOC entry 3370 (class 1259 OID 18144)
-- Name: cms_hero_slides_sort_order_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX cms_hero_slides_sort_order_idx ON public.cms_hero_slides USING btree (sort_order);


--
-- TOC entry 3381 (class 1259 OID 18149)
-- Name: cms_partners_section_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX cms_partners_section_id_idx ON public.cms_partners USING btree (section_id);


--
-- TOC entry 3382 (class 1259 OID 18150)
-- Name: cms_partners_sort_order_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX cms_partners_sort_order_idx ON public.cms_partners USING btree (sort_order);


--
-- TOC entry 3366 (class 1259 OID 18142)
-- Name: cms_sections_section_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX cms_sections_section_key_key ON public.cms_sections USING btree (section_key);


--
-- TOC entry 3377 (class 1259 OID 18147)
-- Name: cms_testimonials_section_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX cms_testimonials_section_id_idx ON public.cms_testimonials USING btree (section_id);


--
-- TOC entry 3378 (class 1259 OID 18148)
-- Name: cms_testimonials_sort_order_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX cms_testimonials_sort_order_idx ON public.cms_testimonials USING btree (sort_order);


--
-- TOC entry 3383 (class 1259 OID 18193)
-- Name: demo_magic_links_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX demo_magic_links_email_idx ON public.demo_magic_links USING btree (email);


--
-- TOC entry 3384 (class 1259 OID 18194)
-- Name: demo_magic_links_lead_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX demo_magic_links_lead_id_idx ON public.demo_magic_links USING btree (lead_id);


--
-- TOC entry 3387 (class 1259 OID 18192)
-- Name: demo_magic_links_token_hash_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX demo_magic_links_token_hash_idx ON public.demo_magic_links USING btree (token_hash);


--
-- TOC entry 3388 (class 1259 OID 18191)
-- Name: demo_magic_links_token_hash_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX demo_magic_links_token_hash_key ON public.demo_magic_links USING btree (token_hash);


--
-- TOC entry 3351 (class 1259 OID 17208)
-- Name: lab_order_items_order_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX lab_order_items_order_id_idx ON public.lab_order_items USING btree (order_id);


--
-- TOC entry 3354 (class 1259 OID 17209)
-- Name: lab_order_items_test_catalog_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX lab_order_items_test_catalog_id_idx ON public.lab_order_items USING btree (test_catalog_id);


--
-- TOC entry 3343 (class 1259 OID 17203)
-- Name: lab_orders_order_number_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX lab_orders_order_number_idx ON public.lab_orders USING btree (order_number);


--
-- TOC entry 3344 (class 1259 OID 17202)
-- Name: lab_orders_order_number_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX lab_orders_order_number_key ON public.lab_orders USING btree (order_number);


--
-- TOC entry 3345 (class 1259 OID 17207)
-- Name: lab_orders_ordered_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX lab_orders_ordered_at_idx ON public.lab_orders USING btree (ordered_at);


--
-- TOC entry 3346 (class 1259 OID 17204)
-- Name: lab_orders_patient_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX lab_orders_patient_id_idx ON public.lab_orders USING btree (patient_id);


--
-- TOC entry 3349 (class 1259 OID 17206)
-- Name: lab_orders_priority_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX lab_orders_priority_idx ON public.lab_orders USING btree (priority);


--
-- TOC entry 3350 (class 1259 OID 17205)
-- Name: lab_orders_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX lab_orders_status_idx ON public.lab_orders USING btree (status);


--
-- TOC entry 3315 (class 1259 OID 18195)
-- Name: leads_approval_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX leads_approval_status_idx ON public.leads USING btree (approval_status);


--
-- TOC entry 3316 (class 1259 OID 16447)
-- Name: leads_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX leads_created_at_idx ON public.leads USING btree (created_at);


--
-- TOC entry 3317 (class 1259 OID 16445)
-- Name: leads_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX leads_email_idx ON public.leads USING btree (email);


--
-- TOC entry 3320 (class 1259 OID 18079)
-- Name: leads_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX leads_status_idx ON public.leads USING btree (status);


--
-- TOC entry 3321 (class 1259 OID 18078)
-- Name: leads_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX leads_user_id_idx ON public.leads USING btree (user_id);


--
-- TOC entry 3330 (class 1259 OID 17198)
-- Name: patients_mrn_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX patients_mrn_idx ON public.patients USING btree (mrn);


--
-- TOC entry 3331 (class 1259 OID 17195)
-- Name: patients_mrn_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX patients_mrn_key ON public.patients USING btree (mrn);


--
-- TOC entry 3332 (class 1259 OID 17197)
-- Name: patients_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX patients_name_idx ON public.patients USING btree (name);


--
-- TOC entry 3333 (class 1259 OID 17196)
-- Name: patients_national_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX patients_national_id_key ON public.patients USING btree (national_id);


--
-- TOC entry 3336 (class 1259 OID 17199)
-- Name: physicians_external_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX physicians_external_code_key ON public.physicians USING btree (external_code);


--
-- TOC entry 3361 (class 1259 OID 18077)
-- Name: roles_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX roles_name_key ON public.roles USING btree (name);


--
-- TOC entry 3355 (class 1259 OID 17211)
-- Name: specimens_barcode_number_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX specimens_barcode_number_idx ON public.specimens USING btree (barcode_number);


--
-- TOC entry 3356 (class 1259 OID 17210)
-- Name: specimens_barcode_number_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX specimens_barcode_number_key ON public.specimens USING btree (barcode_number);


--
-- TOC entry 3357 (class 1259 OID 17212)
-- Name: specimens_order_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX specimens_order_id_idx ON public.specimens USING btree (order_id);


--
-- TOC entry 3360 (class 1259 OID 17213)
-- Name: specimens_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX specimens_status_idx ON public.specimens USING btree (status);


--
-- TOC entry 3339 (class 1259 OID 17201)
-- Name: test_catalogs_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX test_catalogs_category_idx ON public.test_catalogs USING btree (category);


--
-- TOC entry 3340 (class 1259 OID 17200)
-- Name: test_catalogs_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX test_catalogs_code_key ON public.test_catalogs USING btree (code);


--
-- TOC entry 3322 (class 1259 OID 16641)
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- TOC entry 3397 (class 2606 OID 18156)
-- Name: cms_comparison_items cms_comparison_items_section_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cms_comparison_items
    ADD CONSTRAINT cms_comparison_items_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.cms_sections(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3396 (class 2606 OID 18151)
-- Name: cms_hero_slides cms_hero_slides_section_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cms_hero_slides
    ADD CONSTRAINT cms_hero_slides_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.cms_sections(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3399 (class 2606 OID 18166)
-- Name: cms_partners cms_partners_section_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cms_partners
    ADD CONSTRAINT cms_partners_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.cms_sections(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3398 (class 2606 OID 18161)
-- Name: cms_testimonials cms_testimonials_section_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cms_testimonials
    ADD CONSTRAINT cms_testimonials_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.cms_sections(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3400 (class 2606 OID 18196)
-- Name: demo_magic_links demo_magic_links_lead_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demo_magic_links
    ADD CONSTRAINT demo_magic_links_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3401 (class 2606 OID 18201)
-- Name: demo_magic_links demo_magic_links_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demo_magic_links
    ADD CONSTRAINT demo_magic_links_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3393 (class 2606 OID 17224)
-- Name: lab_order_items lab_order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_order_items
    ADD CONSTRAINT lab_order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.lab_orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3394 (class 2606 OID 17229)
-- Name: lab_order_items lab_order_items_test_catalog_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_order_items
    ADD CONSTRAINT lab_order_items_test_catalog_id_fkey FOREIGN KEY (test_catalog_id) REFERENCES public.test_catalogs(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3391 (class 2606 OID 17214)
-- Name: lab_orders lab_orders_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_orders
    ADD CONSTRAINT lab_orders_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3392 (class 2606 OID 17219)
-- Name: lab_orders lab_orders_physician_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_orders
    ADD CONSTRAINT lab_orders_physician_id_fkey FOREIGN KEY (physician_id) REFERENCES public.physicians(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3389 (class 2606 OID 18085)
-- Name: leads leads_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3395 (class 2606 OID 17234)
-- Name: specimens specimens_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.specimens
    ADD CONSTRAINT specimens_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.lab_orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3390 (class 2606 OID 18080)
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE SET NULL;


-- Completed on 2026-11-13 22:14:32

--
-- PostgreSQL database dump complete
--

\unrestrict PgMWaUxxZv9vq4uLPTGslcCaB25g7Aj3eOaaua41WnbL8Qhcgy7qwghSnA1b6uV


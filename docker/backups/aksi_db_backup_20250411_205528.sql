--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-04-11 20:55:33 CEST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 60166)
-- Name: public; Type: SCHEMA; Schema: -; Owner: aksi_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO aksi_user;

--
-- TOC entry 3579 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: aksi_user
--

COMMENT ON SCHEMA public IS '';


--
-- TOC entry 872 (class 1247 OID 60588)
-- Name: ClientSource; Type: TYPE; Schema: public; Owner: aksi_user
--

CREATE TYPE public."ClientSource" AS ENUM (
    'REFERRAL',
    'SOCIAL_MEDIA',
    'GOOGLE',
    'ADVERTISEMENT',
    'RETURNING',
    'WALK_IN',
    'OTHER'
);


ALTER TYPE public."ClientSource" OWNER TO aksi_user;

--
-- TOC entry 869 (class 1247 OID 60580)
-- Name: ClientStatus; Type: TYPE; Schema: public; Owner: aksi_user
--

CREATE TYPE public."ClientStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'BLOCKED'
);


ALTER TYPE public."ClientStatus" OWNER TO aksi_user;

--
-- TOC entry 866 (class 1247 OID 60569)
-- Name: LoyaltyLevel; Type: TYPE; Schema: public; Owner: aksi_user
--

CREATE TYPE public."LoyaltyLevel" AS ENUM (
    'STANDARD',
    'BRONZE',
    'SILVER',
    'GOLD',
    'PLATINUM'
);


ALTER TYPE public."LoyaltyLevel" OWNER TO aksi_user;

--
-- TOC entry 878 (class 1247 OID 60612)
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: aksi_user
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'NEW',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public."OrderStatus" OWNER TO aksi_user;

--
-- TOC entry 875 (class 1247 OID 60604)
-- Name: Role; Type: TYPE; Schema: public; Owner: aksi_user
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'MANAGER',
    'STAFF'
);


ALTER TYPE public."Role" OWNER TO aksi_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 60167)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: aksi_user
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


ALTER TABLE public._prisma_migrations OWNER TO aksi_user;

--
-- TOC entry 226 (class 1259 OID 60877)
-- Name: accounts; Type: TABLE; Schema: public; Owner: aksi_user
--

CREATE TABLE public.accounts (
    id text NOT NULL,
    "userId" uuid NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


ALTER TABLE public.accounts OWNER TO aksi_user;

--
-- TOC entry 220 (class 1259 OID 60630)
-- Name: clients; Type: TABLE; Schema: public; Owner: aksi_user
--

CREATE TABLE public.clients (
    id uuid NOT NULL,
    "fullName" text NOT NULL,
    phone text NOT NULL,
    email text,
    address text,
    birthdate timestamp(3) without time zone,
    notes text,
    "loyaltyLevel" public."LoyaltyLevel" DEFAULT 'STANDARD'::public."LoyaltyLevel" NOT NULL,
    gender text,
    "totalSpent" numeric(10,2) DEFAULT 0 NOT NULL,
    "loyaltyPoints" integer DEFAULT 0 NOT NULL,
    "lastPurchaseAt" timestamp(3) without time zone,
    status public."ClientStatus" DEFAULT 'ACTIVE'::public."ClientStatus" NOT NULL,
    source public."ClientSource" DEFAULT 'OTHER'::public."ClientSource" NOT NULL,
    tags text[],
    "nextContactAt" timestamp(3) without time zone,
    "lastContactAt" timestamp(3) without time zone,
    "allowSMS" boolean DEFAULT true NOT NULL,
    "allowEmail" boolean DEFAULT true NOT NULL,
    "allowCalls" boolean DEFAULT true NOT NULL,
    "frequencyScore" integer DEFAULT 0 NOT NULL,
    "monetaryScore" integer DEFAULT 0 NOT NULL,
    "recencyScore" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public.clients OWNER TO aksi_user;

--
-- TOC entry 225 (class 1259 OID 60732)
-- Name: order_history; Type: TABLE; Schema: public; Owner: aksi_user
--

CREATE TABLE public.order_history (
    id uuid NOT NULL,
    "orderId" uuid NOT NULL,
    status text NOT NULL,
    comment text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdBy" uuid NOT NULL
);


ALTER TABLE public.order_history OWNER TO aksi_user;

--
-- TOC entry 222 (class 1259 OID 60658)
-- Name: order_items; Type: TABLE; Schema: public; Owner: aksi_user
--

CREATE TABLE public.order_items (
    id uuid NOT NULL,
    quantity integer NOT NULL,
    "unitPrice" numeric(10,2) NOT NULL,
    "totalPrice" numeric(10,2) NOT NULL,
    name text NOT NULL,
    category text,
    "orderId" uuid NOT NULL,
    color text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    description text,
    fabric text,
    "itemType" text,
    markings text,
    "priceListItemId" uuid,
    "specialNotes" text,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.order_items OWNER TO aksi_user;

--
-- TOC entry 221 (class 1259 OID 60649)
-- Name: orders; Type: TABLE; Schema: public; Owner: aksi_user
--

CREATE TABLE public.orders (
    id uuid NOT NULL,
    number text NOT NULL,
    "totalAmount" numeric(10,2) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "completedAt" timestamp(3) without time zone,
    "estimatedReleaseDate" timestamp(3) without time zone,
    "paymentMethod" text,
    "prepaidAmount" numeric(10,2) DEFAULT 0,
    notes text,
    "clientId" uuid NOT NULL,
    "userId" uuid,
    status public."OrderStatus" NOT NULL
);


ALTER TABLE public.orders OWNER TO aksi_user;

--
-- TOC entry 223 (class 1259 OID 60665)
-- Name: payments; Type: TABLE; Schema: public; Owner: aksi_user
--

CREATE TABLE public.payments (
    id uuid NOT NULL,
    amount numeric(10,2) NOT NULL,
    method text NOT NULL,
    status text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "clientId" uuid NOT NULL,
    "orderId" uuid
);


ALTER TABLE public.payments OWNER TO aksi_user;

--
-- TOC entry 224 (class 1259 OID 60695)
-- Name: photos; Type: TABLE; Schema: public; Owner: aksi_user
--

CREATE TABLE public.photos (
    id uuid NOT NULL,
    url text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "orderItemId" uuid NOT NULL
);


ALTER TABLE public.photos OWNER TO aksi_user;

--
-- TOC entry 219 (class 1259 OID 60220)
-- Name: price_list_items; Type: TABLE; Schema: public; Owner: aksi_user
--

CREATE TABLE public.price_list_items (
    id uuid NOT NULL,
    "categoryId" uuid NOT NULL,
    "catalogNumber" integer NOT NULL,
    name text NOT NULL,
    "unitOfMeasure" text NOT NULL,
    "basePrice" numeric(10,2) NOT NULL,
    "priceBlack" numeric(10,2),
    "priceColor" numeric(10,2),
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "jsonId" text
);


ALTER TABLE public.price_list_items OWNER TO aksi_user;

--
-- TOC entry 218 (class 1259 OID 60211)
-- Name: service_categories; Type: TABLE; Schema: public; Owner: aksi_user
--

CREATE TABLE public.service_categories (
    id uuid NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.service_categories OWNER TO aksi_user;

--
-- TOC entry 227 (class 1259 OID 60884)
-- Name: sessions; Type: TABLE; Schema: public; Owner: aksi_user
--

CREATE TABLE public.sessions (
    id text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" uuid NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO aksi_user;

--
-- TOC entry 228 (class 1259 OID 60891)
-- Name: verification_tokens; Type: TABLE; Schema: public; Owner: aksi_user
--

CREATE TABLE public.verification_tokens (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.verification_tokens OWNER TO aksi_user;

--
-- TOC entry 3562 (class 0 OID 60167)
-- Dependencies: 217
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: aksi_user
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
d984c3cc-8788-4298-995d-201c7ff2041f	d75eb78da362832ddc8ab79c7acaa5b77475200a7950a241d366140486157186	2025-04-06 16:38:54.503569+02	20250406112707_aksi_new_prisma_1	\N	\N	2025-04-06 16:38:54.489132+02	1
8ef7733d-8fbf-4b14-b310-b2ca4bcc2414	edc888acdde75a96b77f0be347be4c6faf0697ed569b96849490a0ca8b111fcc	2025-04-06 16:38:54.513191+02	20250406114446_add_jsonid_to_pricelist	\N	\N	2025-04-06 16:38:54.505694+02	1
aec08a84-f428-4a2f-8bc3-aad6f511c01f	38edc0fb15e6f0e1dcda046468892ee1b3b85128554e7ab5c388e5e26a46e0d1	2025-04-06 16:38:54.522058+02	20250406143039_add_order_identification_fields	\N	\N	2025-04-06 16:38:54.515315+02	1
41c123a1-8773-4bb5-946e-b2b00691de0b	d41f944cf7902772389fa1246258ee0243f90d82a1a7ed1d879ea853bd710717	2025-04-06 16:41:01.083458+02	20250406144101_add_client_contact_info_fields	\N	\N	2025-04-06 16:41:01.077015+02	1
\.


--
-- TOC entry 3571 (class 0 OID 60877)
-- Dependencies: 226
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: aksi_user
--

COPY public.accounts (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
\.


--
-- TOC entry 3565 (class 0 OID 60630)
-- Dependencies: 220
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: aksi_user
--

COPY public.clients (id, "fullName", phone, email, address, birthdate, notes, "loyaltyLevel", gender, "totalSpent", "loyaltyPoints", "lastPurchaseAt", status, source, tags, "nextContactAt", "lastContactAt", "allowSMS", "allowEmail", "allowCalls", "frequencyScore", "monetaryScore", "recencyScore", "createdAt", "updatedAt", "deletedAt") FROM stdin;
795837f6-fcb1-4b34-9cb6-cf2f94ea0338	Тест Клієнт Один	+380501112233	test1@example.com	вул. Тестова, 1	\N	\N	STANDARD	\N	0.00	0	\N	ACTIVE	OTHER	\N	\N	\N	t	t	t	0	0	0	2025-04-07 12:44:09.447	2025-04-07 12:44:09.447	\N
f47e5fb4-8972-4d8c-ba9f-74be60c6b224	Тест Клієнт Два	+380502223344	test2@example.com	\N	\N	\N	STANDARD	\N	0.00	0	\N	ACTIVE	OTHER	\N	\N	\N	t	t	t	0	0	0	2025-04-07 12:44:09.451	2025-04-07 12:44:09.451	\N
25268731-e27a-46fe-9e40-972e5895bad4	Тест Клієнт Три	+380503334455	\N	вул. Тестова, 3	\N	\N	STANDARD	\N	0.00	0	\N	ACTIVE	OTHER	\N	\N	\N	t	t	t	0	0	0	2025-04-07 12:44:09.455	2025-04-07 12:44:09.455	\N
553e4c41-ed67-4fac-9094-51b62e49ff30	Іван Франко	+380504445566	franko@example.com	\N	\N	\N	STANDARD	\N	0.00	0	\N	ACTIVE	OTHER	\N	\N	\N	t	t	t	0	0	0	2025-04-07 12:44:09.459	2025-04-07 12:44:09.459	\N
ee1d9418-f12e-46ed-b70d-c8c900d2c011	Леся Українка	+380505556677	lesya@example.com	м. Київ	\N	\N	STANDARD	\N	0.00	0	\N	ACTIVE	OTHER	\N	\N	\N	t	t	t	0	0	0	2025-04-07 12:44:09.462	2025-04-07 12:44:09.462	\N
95bc28d3-c171-4ded-b53f-197ab1886f64	Fedotiuk Sergeevich Dmytro	0981784264	dimaurt@gmail.com	Teatral'na Street, 26\n4	\N	\N	STANDARD	\N	0.00	0	\N	ACTIVE	OTHER	\N	\N	\N	t	t	t	0	0	0	2025-04-07 15:20:39.206	2025-04-07 15:20:39.206	\N
2eede521-414b-4c94-a391-478f84189048	Anastasiia Fedotiuk	015226952485	fedotiukdm@gmail.com	Maxim-Gorki-Str. 76	\N	\N	STANDARD	\N	0.00	0	\N	ACTIVE	OTHER	\N	\N	\N	t	t	t	0	0	0	2025-04-07 15:24:23.179	2025-04-07 15:24:23.179	\N
\.


--
-- TOC entry 3570 (class 0 OID 60732)
-- Dependencies: 225
-- Data for Name: order_history; Type: TABLE DATA; Schema: public; Owner: aksi_user
--

COPY public.order_history (id, "orderId", status, comment, "createdAt", "createdBy") FROM stdin;
\.


--
-- TOC entry 3567 (class 0 OID 60658)
-- Dependencies: 222
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: aksi_user
--

COPY public.order_items (id, quantity, "unitPrice", "totalPrice", name, category, "orderId", color, "createdAt", description, fabric, "itemType", markings, "priceListItemId", "specialNotes", "updatedAt") FROM stdin;
\.


--
-- TOC entry 3566 (class 0 OID 60649)
-- Dependencies: 221
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: aksi_user
--

COPY public.orders (id, number, "totalAmount", "createdAt", "completedAt", "estimatedReleaseDate", "paymentMethod", "prepaidAmount", notes, "clientId", "userId", status) FROM stdin;
\.


--
-- TOC entry 3568 (class 0 OID 60665)
-- Dependencies: 223
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: aksi_user
--

COPY public.payments (id, amount, method, status, "createdAt", "clientId", "orderId") FROM stdin;
\.


--
-- TOC entry 3569 (class 0 OID 60695)
-- Dependencies: 224
-- Data for Name: photos; Type: TABLE DATA; Schema: public; Owner: aksi_user
--

COPY public.photos (id, url, description, "createdAt", "orderItemId") FROM stdin;
\.


--
-- TOC entry 3564 (class 0 OID 60220)
-- Dependencies: 219
-- Data for Name: price_list_items; Type: TABLE DATA; Schema: public; Owner: aksi_user
--

COPY public.price_list_items (id, "categoryId", "catalogNumber", name, "unitOfMeasure", "basePrice", "priceBlack", "priceColor", active, "createdAt", "updatedAt", "jsonId") FROM stdin;
dd34ce98-98ca-4d07-b440-08ab7acdb0f7	05b132d6-946b-43d2-90ae-6d98ee301553	7	Капрі	шт	320.00	\N	\N	t	2025-04-06 14:38:55.774	2025-04-07 12:44:08.905	odiah_6_2
b56d05f0-6684-4c49-a541-64ac048803a3	05b132d6-946b-43d2-90ae-6d98ee301553	8	Піджак, кітель	шт	480.00	\N	\N	t	2025-04-06 14:38:55.778	2025-04-07 12:44:08.908	odiah_7
4d96c21d-77c2-46dc-924a-1c1327c89a76	05b132d6-946b-43d2-90ae-6d98ee301553	9	Костюм класичний брючний	шт	740.00	\N	\N	t	2025-04-06 14:38:55.782	2025-04-07 12:44:08.912	odiah_8
1cba8bf6-0718-4c68-bc34-e4e9c7f9f6fd	05b132d6-946b-43d2-90ae-6d98ee301553	10	Сарафан, сукня проста	шт	580.00	\N	\N	t	2025-04-06 14:38:55.785	2025-04-07 12:44:08.915	odiah_9
faf996e7-73fb-4542-9f87-82c70fd2ebd6	05b132d6-946b-43d2-90ae-6d98ee301553	11	Сукня вечірня, з аплікаціями, стразами	шт	1000.00	\N	\N	t	2025-04-06 14:38:55.789	2025-04-07 12:44:08.918	odiah_10_1
a54bea7d-4422-4e87-8b7d-de13329703a4	05b132d6-946b-43d2-90ae-6d98ee301553	12	Сукня вечірня атласна	шт	1250.00	\N	\N	t	2025-04-06 14:38:55.793	2025-04-07 12:44:08.921	odiah_10_2
2857183a-96e3-4c03-940d-27e1fdd0a40e	05b132d6-946b-43d2-90ae-6d98ee301553	13	Сукня весільна проста	шт	2000.00	\N	\N	t	2025-04-06 14:38:55.796	2025-04-07 12:44:08.924	odiah_11_1
19bb9ba4-15ef-446b-b865-7c197c5367da	05b132d6-946b-43d2-90ae-6d98ee301553	14	Сукня весільна складна	шт	2500.00	\N	\N	t	2025-04-06 14:38:55.8	2025-04-07 12:44:08.928	odiah_11_2
09671d78-aa59-45bb-9eef-b86f98c887fa	05b132d6-946b-43d2-90ae-6d98ee301553	15	Корсет	шт	520.00	\N	\N	t	2025-04-06 14:38:55.804	2025-04-07 12:44:08.931	odiah_12_1
4096a382-6fe4-41d8-b34f-4dcd9814b1b6	05b132d6-946b-43d2-90ae-6d98ee301553	16	Корсет весільний	шт	700.00	\N	\N	t	2025-04-06 14:38:55.807	2025-04-07 12:44:08.934	odiah_12_2
31561ed4-7b63-49a1-8322-0adbfc8d8bff	05b132d6-946b-43d2-90ae-6d98ee301553	17	Фата	шт	450.00	\N	\N	t	2025-04-06 14:38:55.811	2025-04-07 12:44:08.937	odiah_12_3
09fe480f-1a3a-48ac-a101-6973a640f555	05b132d6-946b-43d2-90ae-6d98ee301553	18	Майка	шт	280.00	\N	\N	t	2025-04-06 14:38:55.814	2025-04-07 12:44:08.94	odiah_13_1
027ea4ad-2969-4572-9325-9cbf694250d5	05b132d6-946b-43d2-90ae-6d98ee301553	19	Футболка	шт	300.00	\N	\N	t	2025-04-06 14:38:55.817	2025-04-07 12:44:08.944	odiah_13_2
02588c0b-7536-4d2a-8461-5deb7d1ee19e	05b132d6-946b-43d2-90ae-6d98ee301553	20	Гольф, блуза проста	шт	330.00	\N	\N	t	2025-04-06 14:38:55.822	2025-04-07 12:44:08.946	odiah_14_1
56bcc0e1-90d9-4617-bdd1-aa140d203054	05b132d6-946b-43d2-90ae-6d98ee301553	21	Гольф, блуза складна, зі стразами, аплікаціями	шт	380.00	\N	\N	t	2025-04-06 14:38:55.825	2025-04-07 12:44:08.95	odiah_14_2
c8a1f394-5cd0-4497-a763-b24dde6a91a4	05b132d6-946b-43d2-90ae-6d98ee301553	22	Комбінезон жіночий простого фасону	шт	550.00	\N	\N	t	2025-04-06 14:38:55.828	2025-04-07 12:44:08.953	odiah_15_1
7edb0b88-2952-4386-85c5-3b008874f496	05b132d6-946b-43d2-90ae-6d98ee301553	23	Комбінезон жіночий складного фасону	шт	700.00	\N	\N	t	2025-04-06 14:38:55.831	2025-04-07 12:44:08.956	odiah_15_2
2a150547-040d-495e-bdf3-2d92ce28030c	05b132d6-946b-43d2-90ae-6d98ee301553	24	Сорочка чоловіча/жіноча	шт	380.00	\N	\N	t	2025-04-06 14:38:55.835	2025-04-07 12:44:08.959	odiah_16
105787ef-6300-4d10-ad9b-7363cd71340c	05b132d6-946b-43d2-90ae-6d98ee301553	25	Спідниця коротка	шт	350.00	\N	\N	t	2025-04-06 14:38:55.838	2025-04-07 12:44:08.963	odiah_17_1
3501d98c-3885-45a0-84e5-fc29fb500ab2	05b132d6-946b-43d2-90ae-6d98ee301553	26	Спідниця довга	шт	400.00	\N	\N	t	2025-04-06 14:38:55.842	2025-04-07 12:44:08.966	odiah_17_2
6c0e00ea-78d3-4186-aa5d-e2b3d45847d9	05b132d6-946b-43d2-90ae-6d98ee301553	27	Спідниця в складку	шт	550.00	\N	\N	t	2025-04-06 14:38:55.845	2025-04-07 12:44:08.969	odiah_17_3
7cda3a99-97b0-4bf5-959e-ffba96f78f0c	05b132d6-946b-43d2-90ae-6d98ee301553	28	Шарф, шаль, палантин	шт	380.00	\N	\N	t	2025-04-06 14:38:55.848	2025-04-07 12:44:08.973	odiah_18
b5645227-de25-4f23-b050-9e0375030152	05b132d6-946b-43d2-90ae-6d98ee301553	29	Берет, хустина, трикотажна шапка, рукавиці	шт	350.00	\N	\N	t	2025-04-06 14:38:55.852	2025-04-07 12:44:08.976	odiah_19
ba7fa3bf-8055-41be-adce-577a8a05ded9	05b132d6-946b-43d2-90ae-6d98ee301553	30	Капелюх, кепка	шт	350.00	\N	\N	t	2025-04-06 14:38:55.855	2025-04-07 12:44:08.979	odiah_20_1
333b9765-88ec-45d0-a120-d423e00745d1	05b132d6-946b-43d2-90ae-6d98ee301553	31	Фуражка, формений кашкет	шт	400.00	\N	\N	t	2025-04-06 14:38:55.858	2025-04-07 12:44:08.982	odiah_20_2
c076e01d-b77e-42c6-b392-b925aa8d0637	05b132d6-946b-43d2-90ae-6d98ee301553	32	Краватка	шт	250.00	\N	\N	t	2025-04-06 14:38:55.862	2025-04-07 12:44:08.985	odiah_21
886520d2-8856-4600-9b13-7e0ff6e4dc78	05b132d6-946b-43d2-90ae-6d98ee301553	33	Светр теплий	шт	400.00	\N	\N	t	2025-04-06 14:38:55.865	2025-04-07 12:44:08.989	odiah_22_1
f3d29369-ae4d-4a9c-8b35-1f9385b7da41	05b132d6-946b-43d2-90ae-6d98ee301553	34	Светр теплий з оздобленням	шт	450.00	\N	\N	t	2025-04-06 14:38:55.869	2025-04-07 12:44:08.992	odiah_22_2
9e30abab-e470-40d5-9576-c800885d26cf	05b132d6-946b-43d2-90ae-6d98ee301553	35	Пуловер	шт	380.00	\N	\N	t	2025-04-06 14:38:55.872	2025-04-07 12:44:08.995	odiah_23_1
a3bedc67-d307-42d1-9558-32eeb19c6ca5	05b132d6-946b-43d2-90ae-6d98ee301553	36	Пуловер з оздобленням	шт	420.00	\N	\N	t	2025-04-06 14:38:55.876	2025-04-07 12:44:08.998	odiah_23_2
1f0174f1-b143-45fe-935a-0f34e27556d0	05b132d6-946b-43d2-90ae-6d98ee301553	37	Жилет костюмний	шт	350.00	\N	\N	t	2025-04-06 14:38:55.879	2025-04-07 12:44:09.001	odiah_24
af97bd71-f319-499f-a632-5ceb63de72b5	05b132d6-946b-43d2-90ae-6d98ee301553	38	Жилет утеплений штучне хутро	шт	480.00	\N	\N	t	2025-04-06 14:38:55.883	2025-04-07 12:44:09.004	odiah_25_1
712c757d-a215-4273-9644-88218a482a60	05b132d6-946b-43d2-90ae-6d98ee301553	39	Жилет утеплений пуховий	шт	540.00	\N	\N	t	2025-04-06 14:38:55.887	2025-04-07 12:44:09.008	odiah_25_2
7cb2bfd3-26db-4f02-bb77-5cb492ecf830	05b132d6-946b-43d2-90ae-6d98ee301553	40	Плащ, пальто трикотажне	шт	550.00	\N	\N	t	2025-04-06 14:38:55.891	2025-04-07 12:44:09.011	odiah_26_1
5985a1a1-339f-41d0-b119-6eace90620fd	05b132d6-946b-43d2-90ae-6d98ee301553	41	Плащ утеплений	шт	650.00	\N	\N	t	2025-04-06 14:38:55.895	2025-04-07 12:44:09.015	odiah_26_2
666d5cfd-fcc9-4a52-98f5-b876f95af9a5	05b132d6-946b-43d2-90ae-6d98ee301553	42	Півпальто демісезонне (до 70 см)	шт	520.00	\N	\N	t	2025-04-06 14:38:55.899	2025-04-07 12:44:09.017	odiah_27_1
20ef0f61-7e77-416a-a891-28dd158f22e9	05b132d6-946b-43d2-90ae-6d98ee301553	43	Півпальто зимове (до 70 см)	шт	620.00	\N	\N	t	2025-04-06 14:38:55.903	2025-04-07 12:44:09.02	odiah_27_2
fb7982be-61ef-4620-850e-29a59139ef69	05b132d6-946b-43d2-90ae-6d98ee301553	44	Пальто демісезонне	шт	650.00	\N	\N	t	2025-04-06 14:38:55.907	2025-04-07 12:44:09.023	odiah_28_1
252fdc76-fb2a-4149-b417-6cfe4eed53dd	05b132d6-946b-43d2-90ae-6d98ee301553	45	Пальто зимове	шт	750.00	\N	\N	t	2025-04-06 14:38:55.911	2025-04-07 12:44:09.027	odiah_28_2
3c2067a5-2a71-49d7-a966-638b37d05de3	05b132d6-946b-43d2-90ae-6d98ee301553	47	Куртка, пальто на синтепоні — від 80 см	шт	680.00	\N	\N	t	2025-04-06 14:38:55.919	2025-04-07 12:44:09.033	odiah_29_2
f5abef5b-f32d-4b9a-93c3-bf2be612be97	05b132d6-946b-43d2-90ae-6d98ee301553	48	Бушлат	шт	750.00	\N	\N	t	2025-04-06 14:38:55.923	2025-04-07 12:44:09.036	odiah_30
81e0d3ff-58a1-4e38-87ce-9b3fbfca21fc	05b132d6-946b-43d2-90ae-6d98ee301553	49	Куртка літня, вітровка	шт	450.00	\N	\N	t	2025-04-06 14:38:55.926	2025-04-07 12:44:09.039	odiah_31_1
089541a8-1d57-4bda-8f15-9360f900ec41	05b132d6-946b-43d2-90ae-6d98ee301553	50	Куртка осіння	шт	520.00	\N	\N	t	2025-04-06 14:38:55.929	2025-04-07 12:44:09.042	odiah_31_2
9e0a0e4f-0759-47f5-b3f9-f546046a7019	05b132d6-946b-43d2-90ae-6d98ee301553	51	Підстібка зі штучного хутра	шт	450.00	\N	\N	t	2025-04-06 14:38:55.933	2025-04-07 12:44:09.045	odiah_32_1
20680882-273d-4756-8d0e-609db28729be	05b132d6-946b-43d2-90ae-6d98ee301553	52	Підстібка з натурального хутра	шт	680.00	\N	\N	t	2025-04-06 14:38:55.937	2025-04-07 12:44:09.048	odiah_32_2
4bbd373b-2c7e-42b3-bbf4-67f61d9637e2	05b132d6-946b-43d2-90ae-6d98ee301553	2	Брюки спортивні	шт	320.00	\N	\N	t	2025-04-06 14:38:55.755	2025-04-07 12:44:08.888	odiah_2
2ede22de-16e9-4b1b-8320-d7f4f041139e	05b132d6-946b-43d2-90ae-6d98ee301553	4	Костюм спортивний	шт	600.00	\N	\N	t	2025-04-06 14:38:55.762	2025-04-07 12:44:08.894	odiah_4
cedcf569-48a3-474c-b912-0d733f9e9cca	05b132d6-946b-43d2-90ae-6d98ee301553	5	Ряса церковна	шт	950.00	\N	\N	t	2025-04-06 14:38:55.766	2025-04-07 12:44:08.898	odiah_5
7201e2cd-b78b-4c6a-9e11-326d3bcbc233	05b132d6-946b-43d2-90ae-6d98ee301553	6	Шорти	шт	300.00	\N	\N	t	2025-04-06 14:38:55.771	2025-04-07 12:44:08.901	odiah_6_1
e360f3da-8ae9-4967-9ab4-b42a14761dfc	05b132d6-946b-43d2-90ae-6d98ee301553	58	Дублянка штучна, шуба (більше 70 см )	шт	880.00	\N	\N	t	2025-04-06 14:38:55.959	2025-04-07 12:44:09.067	odiah_36
0d306456-5ba4-43ac-9b13-aeb6f9d8d420	05b132d6-946b-43d2-90ae-6d98ee301553	59	Шуба вовняна - до 80см	шт	1200.00	\N	\N	t	2025-04-06 14:38:55.963	2025-04-07 12:44:09.07	odiah_37_1
5a9d25c6-8091-47e6-98de-6f6df7921361	05b132d6-946b-43d2-90ae-6d98ee301553	60	Шуба вовняна - більше 80см	шт	1700.00	\N	\N	t	2025-04-06 14:38:55.966	2025-04-07 12:44:09.073	odiah_37_2
8cad687b-5799-4aae-9e7f-45f381a451bc	05b132d6-946b-43d2-90ae-6d98ee301553	61	Ковдра штучна півторна	шт	560.00	\N	\N	t	2025-04-06 14:38:55.97	2025-04-07 12:44:09.076	odiah_38_1
8aceda37-488a-4d7d-b7d1-afc263838697	05b132d6-946b-43d2-90ae-6d98ee301553	62	Ковдра штучна двоспальна, євро	шт	650.00	\N	\N	t	2025-04-06 14:38:55.974	2025-04-07 12:44:09.079	odiah_38_2
beb75cad-6141-41f0-94ac-9d7a7be50184	05b132d6-946b-43d2-90ae-6d98ee301553	63	Ковдра натуральна півторна	шт	580.00	\N	\N	t	2025-04-06 14:38:55.977	2025-04-07 12:44:09.082	odiah_39_1
3b2227f3-80f9-4741-815a-2645bda19720	05b132d6-946b-43d2-90ae-6d98ee301553	64	Ковдра натуральна двоспальна, євро	шт	720.00	\N	\N	t	2025-04-06 14:38:55.981	2025-04-07 12:44:09.085	odiah_39_2
8bac5431-2db3-4221-978c-29036b6d7795	05b132d6-946b-43d2-90ae-6d98ee301553	65	Ковдра штуч. подвійна півтораспальна	шт	750.00	\N	\N	t	2025-04-06 14:38:55.985	2025-04-07 12:44:09.088	odiah_40_1
61cff9ef-ecad-4325-a010-70f1c1726ec8	05b132d6-946b-43d2-90ae-6d98ee301553	66	Ковдра штуч. подвійна двоспальна, євро	шт	850.00	\N	\N	t	2025-04-06 14:38:55.989	2025-04-07 12:44:09.091	odiah_40_2
4a2dfcd9-132c-4b8b-9701-9640777bdee1	05b132d6-946b-43d2-90ae-6d98ee301553	67	Плед, покривало стібане півтораспальне	шт	480.00	\N	\N	t	2025-04-06 14:38:55.992	2025-04-07 12:44:09.094	odiah_41_1
5a57e9ac-e3f7-4fcc-bd98-fa2f8139c214	05b132d6-946b-43d2-90ae-6d98ee301553	68	Плед, покривало стібане двоспальне	шт	550.00	\N	\N	t	2025-04-06 14:38:55.996	2025-04-07 12:44:09.097	odiah_41_2
9235944d-42ce-46ff-af2b-4eb13a0f055f	05b132d6-946b-43d2-90ae-6d98ee301553	69	Плед, покривало стібане євро	шт	680.00	\N	\N	t	2025-04-06 14:38:55.999	2025-04-07 12:44:09.1	odiah_41_3
b5d51cc0-8a0c-4d30-8401-469d5641d4cf	05b132d6-946b-43d2-90ae-6d98ee301553	70	Чохли автомобільні за 1 місце тонкі	шт	80.00	\N	\N	t	2025-04-06 14:38:56.003	2025-04-07 12:44:09.103	odiah_42_1
35089d4a-c602-48ec-9b76-c886fc2829e7	05b132d6-946b-43d2-90ae-6d98ee301553	71	Чохли автомобільні за 1 місце на поролоні	шт	110.00	\N	\N	t	2025-04-06 14:38:56.007	2025-04-07 12:44:09.106	odiah_42_2
30e3639b-4255-4e13-a922-cc844483c86b	05b132d6-946b-43d2-90ae-6d98ee301553	72	Чохол на крісло	шт	450.00	\N	\N	t	2025-04-06 14:38:56.01	2025-04-07 12:44:09.109	odiah_43_1
358326a4-3e08-47a1-9dcf-29513a9152e4	05b132d6-946b-43d2-90ae-6d98ee301553	73	Чохол на диван	шт	850.00	\N	\N	t	2025-04-06 14:38:56.014	2025-04-07 12:44:09.112	odiah_43_2
0e60f3bc-9aaf-4c29-aeeb-44bc376b069d	05b132d6-946b-43d2-90ae-6d98ee301553	74	Чохли на подушки дитяча	шт	100.00	\N	\N	t	2025-04-06 14:38:56.017	2025-04-07 12:44:09.115	odiah_44_1
9f2b9e9b-d027-4b83-97f6-79a46f5fec36	05b132d6-946b-43d2-90ae-6d98ee301553	75	Чохли на подушки доросла	шт	120.00	\N	\N	t	2025-04-06 14:38:56.02	2025-04-07 12:44:09.118	odiah_44_2
6e783e33-8e8d-42a9-8053-f0423ba63409	05b132d6-946b-43d2-90ae-6d98ee301553	77	Чохли на подушки з наповнюв. натуральним	шт	195.00	\N	\N	t	2025-04-06 14:38:56.028	2025-04-07 12:44:09.124	odiah_45_2
b7ce5d0b-a768-4a4a-a851-2e7c322352d4	05b132d6-946b-43d2-90ae-6d98ee301553	78	Наматрацник одинарний/півтораспальний	шт	650.00	\N	\N	t	2025-04-06 14:38:56.031	2025-04-07 12:44:09.128	odiah_46_1
e5c5d7e8-a8a1-4484-aa18-50dc5b560132	05b132d6-946b-43d2-90ae-6d98ee301553	79	Наматрацник двоспальний	шт	780.00	\N	\N	t	2025-04-06 14:38:56.034	2025-04-07 12:44:09.131	odiah_46_2
ec597517-448a-419c-81a8-fd2180a36daf	05b132d6-946b-43d2-90ae-6d98ee301553	80	Наматрацник подвійний (півтораспальний)	шт	980.00	\N	\N	t	2025-04-06 14:38:56.038	2025-04-07 12:44:09.134	odiah_47_1
d4d24cfe-5f16-47f7-9e60-17e4f4265825	05b132d6-946b-43d2-90ae-6d98ee301553	81	Наматрацник подвійний (двоспальний)	шт	1200.00	\N	\N	t	2025-04-06 14:38:56.042	2025-04-07 12:44:09.137	odiah_47_2
30a6bba3-e9c9-4bd0-a181-fe73bc4b47b6	05b132d6-946b-43d2-90ae-6d98ee301553	82	Подушка дит. синтапон	шт	250.00	\N	\N	t	2025-04-06 14:38:56.046	2025-04-07 12:44:09.14	odiah_48_1
94555ad3-7d17-4263-baec-8837454f2e12	05b132d6-946b-43d2-90ae-6d98ee301553	83	Подушка дит. пухова, вовняна	шт	280.00	\N	\N	t	2025-04-06 14:38:56.05	2025-04-07 12:44:09.143	odiah_48_2
8b0e3024-a13b-420c-bd52-ee34106caedc	05b132d6-946b-43d2-90ae-6d98ee301553	84	Подушка синтапон	шт	230.00	\N	\N	t	2025-04-06 14:38:56.054	2025-04-07 12:44:09.146	odiah_49_1
859bb096-559b-466a-9ed9-fecd0095a17f	05b132d6-946b-43d2-90ae-6d98ee301553	85	Подушка пухова, вовняна	шт	260.00	\N	\N	t	2025-04-06 14:38:56.058	2025-04-07 12:44:09.15	odiah_49_2
26acd1f7-e66f-440f-8b10-39b23f0ebd8a	05b132d6-946b-43d2-90ae-6d98ee301553	86	Іграшка м'яка (до 40 см)	шт	270.00	\N	\N	t	2025-04-06 14:38:56.061	2025-04-07 12:44:09.153	odiah_50
769b5945-8b13-42da-9d1f-4adbfb0cfd99	05b132d6-946b-43d2-90ae-6d98ee301553	87	Іграшка м'яка (до 80 см)	шт	490.00	\N	\N	t	2025-04-06 14:38:56.065	2025-04-07 12:44:09.156	odiah_51
8c2771c7-dce7-49b6-8311-c21aa260620a	05b132d6-946b-43d2-90ae-6d98ee301553	88	Іграшка м'яка (від 80 см, діапазон 950-1200)	шт	950.00	\N	\N	t	2025-04-06 14:38:56.068	2025-04-07 12:44:09.16	odiah_52
4b5f4740-b191-4c8c-a10a-3ea20e49f703	05b132d6-946b-43d2-90ae-6d98ee301553	89	Візок дитячий (в залеж. від к-ті деталей)	шт	950.00	\N	\N	t	2025-04-06 14:38:56.072	2025-04-07 12:44:09.163	odiah_53
be4ae508-2b83-4316-bf5e-6a2a5a60132c	05b132d6-946b-43d2-90ae-6d98ee301553	90	Сумка жіноча	шт	550.00	\N	\N	t	2025-04-06 14:38:56.075	2025-04-07 12:44:09.166	odiah_54_1
7b5838cb-12ba-4b36-863b-3147624dc4ea	05b132d6-946b-43d2-90ae-6d98ee301553	91	Портфель	шт	700.00	\N	\N	t	2025-04-06 14:38:56.079	2025-04-07 12:44:09.169	odiah_54_2
116554d7-9fb3-4be1-91ad-da731aee9ef4	05b132d6-946b-43d2-90ae-6d98ee301553	92	Сумка дорожня, валіза	шт	1250.00	\N	\N	t	2025-04-06 14:38:56.083	2025-04-07 12:44:09.172	odiah_55
becb5ac6-e3b4-4c13-a828-9945694ff218	05b132d6-946b-43d2-90ae-6d98ee301553	93	Жалюзі вертикальні	кг	450.00	\N	\N	t	2025-04-06 14:38:56.086	2025-04-07 12:44:09.175	odiah_56
beca0c89-33c5-4358-a74f-1f9e18054afd	05b132d6-946b-43d2-90ae-6d98ee301553	94	Халат махровий	шт	250.00	\N	\N	t	2025-04-06 14:38:56.09	2025-04-07 12:44:09.178	odiah_57_1
0ecfa8df-7465-4ce9-9b79-dc30cc310760	05b132d6-946b-43d2-90ae-6d98ee301553	95	Халат шовковий	шт	320.00	\N	\N	t	2025-04-06 14:38:56.094	2025-04-07 12:44:09.181	odiah_57_2
009f50a3-2c32-449b-9ad3-c61a204d3815	05b132d6-946b-43d2-90ae-6d98ee301553	96	Скатертина з оздобленням	шт	350.00	\N	\N	t	2025-04-06 14:38:56.097	2025-04-07 12:44:09.184	odiah_58
6a4834b0-efc6-4225-85e6-89fa23f880f6	05b132d6-946b-43d2-90ae-6d98ee301553	97	Формений халат	шт	300.00	\N	\N	t	2025-04-06 14:38:56.101	2025-04-07 12:44:09.187	odiah_59
b6b6dbaa-3752-4cb1-85fe-f7670d4b6654	05b132d6-946b-43d2-90ae-6d98ee301553	98	Формений (медичний, кухонний ) костюм	шт	420.00	\N	\N	t	2025-04-06 14:38:56.105	2025-04-07 12:44:09.19	odiah_60
8c9d4eae-534c-44de-89a6-95c8973a0576	05b132d6-946b-43d2-90ae-6d98ee301553	99	Покривало, ковдра - бавовна, фліс	шт	240.00	\N	\N	t	2025-04-06 14:38:56.109	2025-04-07 12:44:09.193	odiah_61_1
9e38b1bb-02e7-463d-ab61-711584cba778	05b132d6-946b-43d2-90ae-6d98ee301553	100	Покривало, ковдра - вовна	шт	290.00	\N	\N	t	2025-04-06 14:38:56.113	2025-04-07 12:44:09.196	odiah_61_2
912eaccc-e452-458c-8d75-2ce62ff5f090	05b132d6-946b-43d2-90ae-6d98ee301553	54	Пуховик - до 80 см	шт	590.00	\N	\N	t	2025-04-06 14:38:55.944	2025-04-07 12:44:09.054	odiah_33_2
47c117c1-c053-46ce-a238-0418632b9169	05b132d6-946b-43d2-90ae-6d98ee301553	55	Пуховик - до 90см	шт	650.00	\N	\N	t	2025-04-06 14:38:55.948	2025-04-07 12:44:09.057	odiah_34_1
5c27c8a2-425a-4158-b989-90706f4e2c09	05b132d6-946b-43d2-90ae-6d98ee301553	56	Пуховик - більше 90см	шт	750.00	\N	\N	t	2025-04-06 14:38:55.952	2025-04-07 12:44:09.061	odiah_34_2
ba8ecaac-d566-4214-a4aa-10484d95b8e5	05b132d6-946b-43d2-90ae-6d98ee301553	57	Дублянка штучна, шуба (до 70 см )	шт	720.00	\N	\N	t	2025-04-06 14:38:55.956	2025-04-07 12:44:09.063	odiah_35
3a3301c4-e75a-4dd7-b6f7-6d3ca4ac6180	6211ea04-9419-456f-9204-d878e70cc790	5	Фасонна білизна (загрузка — мін 5 кг)	кг	180.00	\N	\N	t	2025-04-06 14:38:56.139	2025-04-07 12:44:09.218	prania_5
ec3af1a4-0db7-49f1-a386-1b18b4678eea	692dcf0b-37ee-40b4-9124-f9b96ea18221	1	Постільна білизна	кг	45.00	\N	\N	t	2025-04-06 14:38:56.146	2025-04-07 12:44:09.224	prasuvanya_1
4ed23109-77c6-4473-9833-d46089cf92ee	692dcf0b-37ee-40b4-9124-f9b96ea18221	2	Тюль, штори	кг	250.00	\N	\N	t	2025-04-06 14:38:56.149	2025-04-07 12:44:09.227	prasuvanya_2
c00703f7-09e9-44c7-b805-ca57e4653b5d	692dcf0b-37ee-40b4-9124-f9b96ea18221	3	Піджак, куртка	шт	230.00	\N	\N	t	2025-04-06 14:38:56.153	2025-04-07 12:44:09.23	prasuvanya_3_1
a073cf3d-56d4-4bbb-856f-25d653e6add3	692dcf0b-37ee-40b4-9124-f9b96ea18221	4	Півпальто, пальто	шт	280.00	\N	\N	t	2025-04-06 14:38:56.157	2025-04-07 12:44:09.234	prasuvanya_3_2
ad72c830-facc-469b-a560-f4d8540b9375	692dcf0b-37ee-40b4-9124-f9b96ea18221	5	Брюки	шт	200.00	\N	\N	t	2025-04-06 14:38:56.161	2025-04-07 12:44:09.236	prasuvanya_4_1
f8ed5f06-e7ac-4eb5-8b1e-1cff7630dc78	692dcf0b-37ee-40b4-9124-f9b96ea18221	6	Светр, пуловер	шт	200.00	\N	\N	t	2025-04-06 14:38:56.165	2025-04-07 12:44:09.24	prasuvanya_4_2
be4f7acb-be62-4b9f-aaa3-c902faaef6ec	692dcf0b-37ee-40b4-9124-f9b96ea18221	7	Сорочка	шт	200.00	\N	\N	t	2025-04-06 14:38:56.168	2025-04-07 12:44:09.243	prasuvanya_4_3
9f7a98fc-694f-4374-8d53-a45249b71302	692dcf0b-37ee-40b4-9124-f9b96ea18221	8	Спідниця	шт	200.00	\N	\N	t	2025-04-06 14:38:56.171	2025-04-07 12:44:09.246	prasuvanya_5_1
2aa328a0-ac55-4ded-97df-9f77f20cb76a	692dcf0b-37ee-40b4-9124-f9b96ea18221	9	Спідниця складного фасону	шт	250.00	\N	\N	t	2025-04-06 14:38:56.175	2025-04-07 12:44:09.249	prasuvanya_5_2
681b17bc-0124-4e9d-9464-5b668ea6a3bc	692dcf0b-37ee-40b4-9124-f9b96ea18221	10	Сукня проста	шт	350.00	\N	\N	t	2025-04-06 14:38:56.178	2025-04-07 12:44:09.252	prasuvanya_6_1
eaff8a37-aa15-483f-81b2-c300b06245e0	692dcf0b-37ee-40b4-9124-f9b96ea18221	11	Сукня складного фасону	шт	450.00	\N	\N	t	2025-04-06 14:38:56.182	2025-04-07 12:44:09.255	prasuvanya_6_2
91df23a3-6be7-4917-858f-c806be66cd3e	692dcf0b-37ee-40b4-9124-f9b96ea18221	12	Сукня весільна	шт	1200.00	\N	\N	t	2025-04-06 14:38:56.186	2025-04-07 12:44:09.258	prasuvanya_7_1
6c7c7a9a-32ea-4885-9e8c-f99a40a3e15d	692dcf0b-37ee-40b4-9124-f9b96ea18221	13	Сукня весільна складного фасону	шт	1700.00	\N	\N	t	2025-04-06 14:38:56.19	2025-04-07 12:44:09.261	prasuvanya_7_2
dc994782-4b5e-4e58-af76-a6d344d3280d	692dcf0b-37ee-40b4-9124-f9b96ea18221	14	Дублянка, шкіряне пальто, плащ	шт	1200.00	\N	\N	t	2025-04-06 14:38:56.194	2025-04-07 12:44:09.264	prasuvanya_8
9403dad8-9901-48f0-aed8-39fe88e8dc24	692dcf0b-37ee-40b4-9124-f9b96ea18221	15	Розпушування пуховика	шт	420.00	\N	\N	t	2025-04-06 14:38:56.197	2025-04-07 12:44:09.267	prasuvanya_9
77035e50-4083-4e11-8b4a-3d548672a7f1	fc30883e-fb3c-4034-8752-492e051d9cc5	1	Брюки	шт	1100.00	\N	\N	t	2025-04-06 14:38:56.204	2025-04-07 12:44:09.273	shkiriani_1
4dacbc65-ab12-4325-b47c-422d0ce1a341	fc30883e-fb3c-4034-8752-492e051d9cc5	2	Капрі	шт	850.00	\N	\N	t	2025-04-06 14:38:56.208	2025-04-07 12:44:09.275	shkiriani_2
4cb0d4f3-cb8a-4ba2-a0f2-3f67356cee03	fc30883e-fb3c-4034-8752-492e051d9cc5	3	Комір малий	шт	390.00	\N	\N	t	2025-04-06 14:38:56.212	2025-04-07 12:44:09.278	shkiriani_3_1
8fd3fa91-f799-4f4f-a08f-0a05110e0521	fc30883e-fb3c-4034-8752-492e051d9cc5	4	Комір великий	шт	490.00	\N	\N	t	2025-04-06 14:38:56.215	2025-04-07 12:44:09.282	shkiriani_3_2
7ca7d99f-1cba-469f-bc38-bb7210283c24	fc30883e-fb3c-4034-8752-492e051d9cc5	5	Жилет шкіряний	шт	840.00	\N	\N	t	2025-04-06 14:38:56.219	2025-04-07 12:44:09.285	shkiriani_4_1
3386e441-65ae-4b80-aeaa-f9e40fb286c5	fc30883e-fb3c-4034-8752-492e051d9cc5	6	Жилет замш, нубук	шт	950.00	\N	\N	t	2025-04-06 14:38:56.222	2025-04-07 12:44:09.288	shkiriani_4_2
7f6354f5-9ffc-4c57-8508-452c9975c6ed	fc30883e-fb3c-4034-8752-492e051d9cc5	7	Куртка, піджак з гладкої шкіри (до 70 см)	шт	1100.00	\N	\N	t	2025-04-06 14:38:56.225	2025-04-07 12:44:09.29	shkiriani_5
d4381d39-67ef-4a52-bb0e-524bb9b60d6f	fc30883e-fb3c-4034-8752-492e051d9cc5	9	Куртка з нубуку, спілоку, замші (до 70 см)	шт	1300.00	\N	\N	t	2025-04-06 14:38:56.232	2025-04-07 12:44:09.297	shkiriani_7
c55a985e-015d-4b8c-9aea-65b8678e6408	fc30883e-fb3c-4034-8752-492e051d9cc5	10	Куртка з нубуку, спілоку, замші (більше 70 см)	шт	1500.00	\N	\N	t	2025-04-06 14:38:56.236	2025-04-07 12:44:09.3	shkiriani_8
eeb6faee-ca79-4dfe-8be1-c1045a64422b	fc30883e-fb3c-4034-8752-492e051d9cc5	11	Рукавички	пара	850.00	\N	\N	t	2025-04-06 14:38:56.24	2025-04-07 12:44:09.303	shkiriani_9
08d1c1e5-c06a-4634-8ad0-9e0cd99a88ae	fc30883e-fb3c-4034-8752-492e051d9cc5	12	Плащ з гладкої шкіри (до 110 см)	шт	1500.00	\N	\N	t	2025-04-06 14:38:56.244	2025-04-07 12:44:09.306	shkiriani_10
8d725454-eb1d-4445-8cdd-d6ade5f6f715	fc30883e-fb3c-4034-8752-492e051d9cc5	13	Плащ з гладкої шкіри (більше 110 см)	шт	1650.00	\N	\N	t	2025-04-06 14:38:56.248	2025-04-07 12:44:09.309	shkiriani_11
9a8fdcf2-436b-4c47-b0bd-9bdaf3145c86	fc30883e-fb3c-4034-8752-492e051d9cc5	14	Плащ з нубуку, спілоку, замші (до 110 см)	шт	1700.00	\N	\N	t	2025-04-06 14:38:56.251	2025-04-07 12:44:09.312	shkiriani_12
a746c15d-708b-444d-9e5a-4581c086d655	fc30883e-fb3c-4034-8752-492e051d9cc5	15	Плащ з нубуку, спілоку, замші (більше 110 см)	шт	1900.00	\N	\N	t	2025-04-06 14:38:56.255	2025-04-07 12:44:09.315	shkiriani_13
d55288c9-104d-46cd-b68e-81e25cc55dee	fc30883e-fb3c-4034-8752-492e051d9cc5	16	Сорочка	шт	1050.00	\N	\N	t	2025-04-06 14:38:56.259	2025-04-07 12:44:09.317	shkiriani_14
554f9e6f-0f6b-4104-ab69-017ffab9261d	fc30883e-fb3c-4034-8752-492e051d9cc5	17	Спідниця (до 60 см)	шт	980.00	\N	\N	t	2025-04-06 14:38:56.262	2025-04-07 12:44:09.32	shkiriani_15
f99c92e2-ec4d-4ce8-8b23-915360d8b278	fc30883e-fb3c-4034-8752-492e051d9cc5	18	Спідниця (більше 60 см)	шт	1100.00	\N	\N	t	2025-04-06 14:38:56.265	2025-04-07 12:44:09.323	shkiriani_16
86ede7ec-544c-4727-b48a-42e78b823cf9	fc30883e-fb3c-4034-8752-492e051d9cc5	19	Сукня (до 70 см)	шт	1150.00	\N	\N	t	2025-04-06 14:38:56.269	2025-04-07 12:44:09.326	shkiriani_17
5c91d415-5d66-47c8-a715-fc53c1c06cff	fc30883e-fb3c-4034-8752-492e051d9cc5	20	Сукня (більше 70 см)	шт	1250.00	\N	\N	t	2025-04-06 14:38:56.272	2025-04-07 12:44:09.329	shkiriani_18
8d6ebb2a-57b2-402a-8342-5fb0d0536ebf	fc30883e-fb3c-4034-8752-492e051d9cc5	21	Сумка маленька	шт	900.00	\N	\N	t	2025-04-06 14:38:56.275	2025-04-07 12:44:09.333	shkiriani_19_1
15411fa5-5419-497f-9163-9f98691fa706	fc30883e-fb3c-4034-8752-492e051d9cc5	22	Сумка велика	шт	1200.00	\N	\N	t	2025-04-06 14:38:56.279	2025-04-07 12:44:09.335	shkiriani_19_2
4a994509-587b-4c9c-8f30-53c231e2ae98	fc30883e-fb3c-4034-8752-492e051d9cc5	23	Шапка хутряна	шт	500.00	\N	\N	t	2025-04-06 14:38:56.282	2025-04-07 12:44:09.338	shkiriani_20_1
9f4c1d7b-235e-4d48-b7a3-935a81d65d9a	fc30883e-fb3c-4034-8752-492e051d9cc5	24	Шапка шкіряна	шт	650.00	\N	\N	t	2025-04-06 14:38:56.286	2025-04-07 12:44:09.341	shkiriani_20_2
124d1ed4-1818-4c21-8d9b-4ecc52a43805	fc30883e-fb3c-4034-8752-492e051d9cc5	25	Берет, кепка	шт	590.00	\N	\N	t	2025-04-06 14:38:56.29	2025-04-07 12:44:09.345	shkiriani_21
dd93dee9-24d2-488c-9693-976beaa96ab8	fc30883e-fb3c-4034-8752-492e051d9cc5	26	Босоніжки	пара	750.00	\N	\N	t	2025-04-06 14:38:56.293	2025-04-07 12:44:09.348	shkiriani_22
63a03c1e-55b3-4aad-a265-2be2f2724ac1	fc30883e-fb3c-4034-8752-492e051d9cc5	27	Туфлі, мокасини	пара	900.00	\N	\N	t	2025-04-06 14:38:56.296	2025-04-07 12:44:09.351	shkiriani_23_1
2cada5d1-bde6-4630-a1c4-8a999dcd4554	fc30883e-fb3c-4034-8752-492e051d9cc5	28	Чоботи	пара	1200.00	\N	\N	t	2025-04-06 14:38:56.3	2025-04-07 12:44:09.354	shkiriani_23_2
632206ef-9b6a-40a0-b167-17c6941db59b	fc30883e-fb3c-4034-8752-492e051d9cc5	29	Півчоботи	пара	1400.00	\N	\N	t	2025-04-06 14:38:56.304	2025-04-07 12:44:09.357	shkiriani_23_3
4b8247ac-fdbb-4a94-b996-f513ae2284be	faec48c2-7801-456f-8ce9-74c50543e971	1	Жилет	шт	1250.00	\N	\N	t	2025-04-06 14:38:56.311	2025-04-07 12:44:09.363	dublyanky_1
59640941-798a-4aeb-a7a1-19a5f8c449c1	faec48c2-7801-456f-8ce9-74c50543e971	2	Дублянка (до 70 см)	шт	1550.00	\N	\N	t	2025-04-06 14:38:56.315	2025-04-07 12:44:09.366	dublyanky_2
a9e388fd-29af-4fc7-88f6-967101efbaaa	6211ea04-9419-456f-9204-d878e70cc790	1	Постільна білизна	кг	65.00	\N	\N	t	2025-04-06 14:38:56.124	2025-04-07 12:44:09.206	prania_1
e7c03995-29c6-4e75-822b-579cc57149cc	6211ea04-9419-456f-9204-d878e70cc790	2	Скатертини	кг	150.00	\N	\N	t	2025-04-06 14:38:56.128	2025-04-07 12:44:09.208	prania_2
714c2a94-ac5a-4718-8cee-1fb8ce6b8f84	6211ea04-9419-456f-9204-d878e70cc790	3	Тюль, штори, ламбрекени	кг	250.00	\N	\N	t	2025-04-06 14:38:56.132	2025-04-07 12:44:09.211	prania_3
bd93aa70-0a6c-4565-82ab-840fe54a976a	6211ea04-9419-456f-9204-d878e70cc790	4	Простирадло махрове	шт	250.00	\N	\N	t	2025-04-06 14:38:56.135	2025-04-07 12:44:09.214	prania_4
6e56e704-64bc-4ed5-9e16-f5c439fc55fd	dc1f4896-c2cb-4e57-8f1e-8e9e436b5f1a	4	Шуба з цінного хутра більше 90 см (норка, песець, куниця, соболь, бобер, чорнобурка)	шт	2700.00	\N	\N	t	2025-04-06 14:38:56.341	2025-04-07 12:44:09.387	hutriani_4
0b4df37b-f77c-41b7-aa18-4ee2c3c8ce17	3c628da6-b390-43b3-afb0-e4e4f73fea7c	2	Пришивання гудзиків (текстиль)	шт	30.00	\N	\N	t	2025-04-06 14:38:56.414	2025-04-07 12:44:09.441	pryshyvannya_gudzikiv_textile
cda7ff2b-32bf-4065-9f1c-70ef02e6fd5a	dc1f4896-c2cb-4e57-8f1e-8e9e436b5f1a	5	Жилет хутряний	шт	1500.00	\N	\N	t	2025-04-06 14:38:56.344	2025-04-07 12:44:09.39	hutriani_5
0b227fa5-6322-464c-ac4a-0aafcc39770b	3c628da6-b390-43b3-afb0-e4e4f73fea7c	3	Пришивання гудзиків (шкіра)	шт	50.00	\N	\N	t	2025-04-06 14:38:56.418	2025-04-07 12:44:09.443	pryshyvannya_gudzikiv_shkira
6c6e0bb6-a7e0-4e58-a944-633e5e8f209b	05b132d6-946b-43d2-90ae-6d98ee301553	1	Брюки	шт	380.00	\N	\N	t	2025-04-06 14:38:55.751	2025-04-07 12:44:08.883	odiah_1
e498dc22-1d27-467f-a3fb-17546dd90115	05b132d6-946b-43d2-90ae-6d98ee301553	3	Комбінезон, брюки з утеплювачем	шт	550.00	\N	\N	t	2025-04-06 14:38:55.759	2025-04-07 12:44:08.891	odiah_3
80cd5cfc-3129-4e9c-b411-97aeb32fbe06	05b132d6-946b-43d2-90ae-6d98ee301553	46	Куртка, пальто на синтепоні — до 80см	шт	600.00	\N	\N	t	2025-04-06 14:38:55.915	2025-04-07 12:44:09.03	odiah_29_1
dac42cff-759f-4e2a-8849-c14b1ac9ac73	05b132d6-946b-43d2-90ae-6d98ee301553	53	Пуховик - до 70 см	шт	520.00	\N	\N	t	2025-04-06 14:38:55.94	2025-04-07 12:44:09.052	odiah_33_1
c1045014-3a80-4bb2-8045-b9d26986ebf2	05b132d6-946b-43d2-90ae-6d98ee301553	76	Чохли на подушки з наповнюв. штучним	шт	160.00	\N	\N	t	2025-04-06 14:38:56.024	2025-04-07 12:44:09.121	odiah_45_1
f5a49343-fca6-42e4-a502-15ec0c672ca7	05b132d6-946b-43d2-90ae-6d98ee301553	101	Драпірувальні вироби з органзи	кг	300.00	\N	\N	t	2025-04-06 14:38:56.117	2025-04-07 12:44:09.2	odiah_62
1999264a-d100-41a3-89dd-b1ab1ea0e91c	fc30883e-fb3c-4034-8752-492e051d9cc5	8	Куртка, піджак з гладкої шкіри (більше 70 см)	шт	1250.00	\N	\N	t	2025-04-06 14:38:56.229	2025-04-07 12:44:09.294	shkiriani_6
65ea3728-f2cc-4d3e-9a79-0e2ef330743e	faec48c2-7801-456f-8ce9-74c50543e971	3	Дублянка (до 90 см)	шт	1800.00	\N	\N	t	2025-04-06 14:38:56.318	2025-04-07 12:44:09.369	dublyanky_3
7abe7e6c-5fe8-428e-bbdc-9c8502c74ea3	faec48c2-7801-456f-8ce9-74c50543e971	4	Дублянка (більше 90 см)	шт	1950.00	\N	\N	t	2025-04-06 14:38:56.322	2025-04-07 12:44:09.372	dublyanky_4
dfe15567-ccbe-4af7-896d-02b70678f356	dc1f4896-c2cb-4e57-8f1e-8e9e436b5f1a	1	Шуба (до 90 см)	шт	1900.00	\N	\N	t	2025-04-06 14:38:56.329	2025-04-07 12:44:09.377	hutriani_1
386bb85a-f116-4e61-b85f-93f33caf9bb9	dc1f4896-c2cb-4e57-8f1e-8e9e436b5f1a	2	Шуба (більше 90 см)	шт	2100.00	\N	\N	t	2025-04-06 14:38:56.333	2025-04-07 12:44:09.381	hutriani_2
0049a127-b18a-4e3e-a2c1-3c4c4b9d7c09	dc1f4896-c2cb-4e57-8f1e-8e9e436b5f1a	3	Шуба з цінного хутра до 90 см (норка, песець, куниця, соболь, бобер, чорнобурка)	шт	2400.00	\N	\N	t	2025-04-06 14:38:56.337	2025-04-07 12:44:09.384	hutriani_3
80465b50-6079-4c08-aec0-132ec029ff4c	dc1f4896-c2cb-4e57-8f1e-8e9e436b5f1a	6	Шкіра з натур.хутра - 1 кв.м. або за 1 штуку	кв.м	1000.00	\N	\N	t	2025-04-06 14:38:56.347	2025-04-07 12:44:09.393	hutriani_6
c955b466-055a-48c7-b42e-bff45f2bc61c	d220a1dd-f21d-4db4-b566-0dc2cbea00fa	1	Джинси	шт	500.00	\N	700.00	t	2025-04-06 14:38:56.357	2025-04-07 12:44:09.399	farbuvannia_1
d2b116e3-f920-40f0-8361-87bf54536e85	d220a1dd-f21d-4db4-b566-0dc2cbea00fa	2	Брюки спортивні	шт	450.00	\N	650.00	t	2025-04-06 14:38:56.362	2025-04-07 12:44:09.403	farbuvannia_2_1
8c29ca54-28e6-401f-a88e-909b6a7e743b	d220a1dd-f21d-4db4-b566-0dc2cbea00fa	3	Куртка вітровка, байка, светр	шт	460.00	\N	560.00	t	2025-04-06 14:38:56.367	2025-04-07 12:44:09.406	farbuvannia_2_2
fcbf0f12-462d-4681-9308-4c2163662c01	d220a1dd-f21d-4db4-b566-0dc2cbea00fa	4	Куртка утеплена	шт	700.00	\N	850.00	t	2025-04-06 14:38:56.371	2025-04-07 12:44:09.409	farbuvannia_3
bfd65c1a-79de-44b1-8686-2b6f20ab7093	d220a1dd-f21d-4db4-b566-0dc2cbea00fa	5	Спорт. костюм, байковий	шт	780.00	\N	880.00	t	2025-04-06 14:38:56.375	2025-04-07 12:44:09.413	farbuvannia_4
7c682dde-1f5d-4679-94fe-758e3cbbdea2	d220a1dd-f21d-4db4-b566-0dc2cbea00fa	6	Сукня , спідниця	шт	480.00	\N	580.00	t	2025-04-06 14:38:56.379	2025-04-07 12:44:09.416	farbuvannia_5
5128c0de-2dca-4c66-9645-b3b639f8098a	d220a1dd-f21d-4db4-b566-0dc2cbea00fa	7	Кепка	шт	250.00	\N	350.00	t	2025-04-06 14:38:56.383	2025-04-07 12:44:09.419	farbuvannia_6
72c6d1c3-22aa-4dc5-8030-695a7af7e646	d220a1dd-f21d-4db4-b566-0dc2cbea00fa	8	Футболка	шт	280.00	\N	380.00	t	2025-04-06 14:38:56.389	2025-04-07 12:44:09.422	farbuvannia_7
9161d9d9-91ae-42b2-be4a-eb6d22457cfc	d220a1dd-f21d-4db4-b566-0dc2cbea00fa	9	Шорти	шт	380.00	\N	480.00	t	2025-04-06 14:38:56.394	2025-04-07 12:44:09.425	farbuvannia_8
790f5023-392c-4b17-bc42-0fad3484dfef	d220a1dd-f21d-4db4-b566-0dc2cbea00fa	10	Сорочка	шт	400.00	\N	500.00	t	2025-04-06 14:38:56.398	2025-04-07 12:44:09.428	farbuvannia_9
520e08a2-4eef-44ed-a242-170932aa668b	d220a1dd-f21d-4db4-b566-0dc2cbea00fa	11	Плащ	шт	650.00	\N	750.00	t	2025-04-06 14:38:56.403	2025-04-07 12:44:09.431	farbuvannia_10
dbec78c2-99af-444a-abd0-bf8a4a56d98c	3c628da6-b390-43b3-afb0-e4e4f73fea7c	1	Виведення плям (до 5 см.кв.)	шт	140.00	\N	\N	t	2025-04-06 14:38:56.411	2025-04-07 12:44:09.437	dodatkovi_1
\.


--
-- TOC entry 3563 (class 0 OID 60211)
-- Dependencies: 218
-- Data for Name: service_categories; Type: TABLE DATA; Schema: public; Owner: aksi_user
--

COPY public.service_categories (id, code, name, description, "sortOrder", "createdAt", "updatedAt") FROM stdin;
05b132d6-946b-43d2-90ae-6d98ee301553	odiah	Чистка одягу та текстилю	\N	0	2025-04-06 14:38:55.738	2025-04-07 12:44:08.87
6211ea04-9419-456f-9204-d878e70cc790	prania_bilyzny	Прання білизни	\N	0	2025-04-06 14:38:56.121	2025-04-07 12:44:09.202
692dcf0b-37ee-40b4-9124-f9b96ea18221	prasuvanya	Прасування	\N	0	2025-04-06 14:38:56.142	2025-04-07 12:44:09.221
fc30883e-fb3c-4034-8752-492e051d9cc5	shkiriani_vyroby	Чистка та відновлення шкіряних виробів	\N	0	2025-04-06 14:38:56.2	2025-04-07 12:44:09.27
faec48c2-7801-456f-8ce9-74c50543e971	dublyanky	Дублянки	\N	0	2025-04-06 14:38:56.308	2025-04-07 12:44:09.36
dc1f4896-c2cb-4e57-8f1e-8e9e436b5f1a	hutriani_vyroby	Вироби із натурального хутра	\N	0	2025-04-06 14:38:56.325	2025-04-07 12:44:09.375
d220a1dd-f21d-4db4-b566-0dc2cbea00fa	farbuvannia	Фарбування текстильних виробів	\N	0	2025-04-06 14:38:56.351	2025-04-07 12:44:09.396
3c628da6-b390-43b3-afb0-e4e4f73fea7c	dodatkovi_poslugy	Додаткові послуги	\N	0	2025-04-06 14:38:56.407	2025-04-07 12:44:09.434
\.


--
-- TOC entry 3572 (class 0 OID 60884)
-- Dependencies: 227
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: aksi_user
--

COPY public.sessions (id, "sessionToken", "userId", expires) FROM stdin;
\.


--
-- TOC entry 3573 (class 0 OID 60891)
-- Dependencies: 228
-- Data for Name: verification_tokens; Type: TABLE DATA; Schema: public; Owner: aksi_user
--

COPY public.verification_tokens (identifier, token, expires) FROM stdin;
\.


--
-- TOC entry 3359 (class 2606 OID 60175)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: aksi_user
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3402 (class 2606 OID 60883)
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: aksi_user
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- TOC entry 3377 (class 2606 OID 60648)
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: aksi_user
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- TOC entry 3400 (class 2606 OID 60739)
-- Name: order_history order_history_pkey; Type: CONSTRAINT; Schema: public; Owner: aksi_user
--

ALTER TABLE ONLY public.order_history
    ADD CONSTRAINT order_history_pkey PRIMARY KEY (id);


--
-- TOC entry 3389 (class 2606 OID 60664)
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: aksi_user
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3384 (class 2606 OID 60657)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: aksi_user
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 3394 (class 2606 OID 60672)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: aksi_user
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- TOC entry 3398 (class 2606 OID 60702)
-- Name: photos photos_pkey; Type: CONSTRAINT; Schema: public; Owner: aksi_user
--

ALTER TABLE ONLY public.photos
    ADD CONSTRAINT photos_pkey PRIMARY KEY (id);


--
-- TOC entry 3368 (class 2606 OID 60228)
-- Name: price_list_items price_list_items_pkey; Type: CONSTRAINT; Schema: public; Owner: aksi_user
--

ALTER TABLE ONLY public.price_list_items
    ADD CONSTRAINT price_list_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3362 (class 2606 OID 60219)
-- Name: service_categories service_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: aksi_user
--

ALTER TABLE ONLY public.service_categories
    ADD CONSTRAINT service_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 3405 (class 2606 OID 60890)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: aksi_user
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 3403 (class 1259 OID 60896)
-- Name: accounts_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: aksi_user
--

CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON public.accounts USING btree (provider, "providerAccountId");


--
-- TOC entry 3369 (class 1259 OID 60759)
-- Name: clients_deletedAt_idx; Type: INDEX; Schema: public; Owner: aksi_user
--

CREATE INDEX "clients_deletedAt_idx" ON public.clients USING btree ("deletedAt");


--
-- TOC entry 3370 (class 1259 OID 60753)
-- Name: clients_email_idx; Type: INDEX; Schema: public; Owner: aksi_user
--

CREATE INDEX clients_email_idx ON public.clients USING btree (email);


--
-- TOC entry 3371 (class 1259 OID 60751)
-- Name: clients_email_key; Type: INDEX; Schema: public; Owner: aksi_user
--

CREATE UNIQUE INDEX clients_email_key ON public.clients USING btree (email);


--
-- TOC entry 3372 (class 1259 OID 60754)
-- Name: clients_lastPurchaseAt_idx; Type: INDEX; Schema: public; Owner: aksi_user
--

CREATE INDEX "clients_lastPurchaseAt_idx" ON public.clients USING btree ("lastPurchaseAt");


--
-- TOC entry 3373 (class 1259 OID 60755)
-- Name: clients_loyaltyLevel_idx; Type: INDEX; Schema: public; Owner: aksi_user
--

CREATE INDEX "clients_loyaltyLevel_idx" ON public.clients USING btree ("loyaltyLevel");


--
-- TOC entry 3374 (class 1259 OID 60752)
-- Name: clients_phone_idx; Type: INDEX; Schema: public; Owner: aksi_user
--

CREATE INDEX clients_phone_idx ON public.clients USING btree (phone);


--
-- TOC entry 3375 (class 1259 OID 60750)
-- Name: clients_phone_key; Type: INDEX; Schema: public; Owner: aksi_user
--

CREATE UNIQUE INDEX clients_phone_key ON public.clients USING btree (phone);


--
-- TOC entry 3378 (class 1259 OID 60758)
-- Name: clients_recencyScore_frequencyScore_monetaryScore_idx; Type: INDEX; Schema: public; Owner: aksi_user
--

CREATE INDEX "clients_recencyScore_frequencyScore_monetaryScore_idx" ON public.clients USING btree ("recencyScore", "frequencyScore", "monetaryScore");


--
-- TOC entry 3379 (class 1259 OID 60756)
-- Name: clients_status_createdAt_idx; Type: INDEX; Schema: public; Owner: aksi_user
--

CREATE INDEX "clients_status_createdAt_idx" ON public.clients USING btree (status, "createdAt");


--
-- TOC entry 3380 (class 1259 OID 60757)
-- Name: clients_totalSpent_idx; Type: INDEX; Schema: public; Owner: aksi_user
--

CREATE INDEX "clients_totalSpent_idx" ON public.clients USING btree ("totalSpent");


--
-- TOC entry 3387 (class 1259 OID 60764)
-- Name: order_items_orderId_idx; Type: INDEX; Schema: public; Owner: aksi_user
--

CREATE INDEX "order_items_orderId_idx" ON public.order_items USING btree ("orderId");


--
-- TOC entry 3390 (class 1259 OID 60863)
-- Name: order_items_priceListItemId_idx; Type: INDEX; Schema: public; Owner: aksi_user
--

CREATE INDEX "order_items_priceListItemId_idx" ON public.order_items USING btree ("priceListItemId");


--
-- TOC entry 3381 (class 1259 OID 60761)
-- Name: orders_clientId_idx; Type: INDEX; Schema: public; Owner: aksi_user
--

CREATE INDEX "orders_clientId_idx" ON public.orders USING btree ("clientId");


--
-- TOC entry 3382 (class 1259 OID 60760)
-- Name: orders_number_key; Type: INDEX; Schema: public; Owner: aksi_user
--

CREATE UNIQUE INDEX orders_number_key ON public.orders USING btree (number);


--
-- TOC entry 3385 (class 1259 OID 60763)
-- Name: orders_status_createdAt_idx; Type: INDEX; Schema: public; Owner: aksi_user
--

CREATE INDEX "orders_status_createdAt_idx" ON public.orders USING btree (status, "createdAt");


--
-- TOC entry 3386 (class 1259 OID 60762)
-- Name: orders_userId_idx; Type: INDEX; Schema: public; Owner: aksi_user
--

CREATE INDEX "orders_userId_idx" ON public.orders USING btree ("userId");


--
-- TOC entry 3391 (class 1259 OID 60766)
-- Name: payments_clientId_idx; Type: INDEX; Schema: public; Owner: aksi_user
--

CREATE INDEX "payments_clientId_idx" ON public.payments USING btree ("clientId");


--
-- TOC entry 3392 (class 1259 OID 60767)
-- Name: payments_orderId_idx; Type: INDEX; Schema: public; Owner: aksi_user
--

CREATE INDEX "payments_orderId_idx" ON public.payments USING btree ("orderId");


--
-- TOC entry 3395 (class 1259 OID 60768)
-- Name: payments_status_idx; Type: INDEX; Schema: public; Owner: aksi_user
--

CREATE INDEX payments_status_idx ON public.payments USING btree (status);


--
-- TOC entry 3396 (class 1259 OID 60864)
-- Name: photos_orderItemId_idx; Type: INDEX; Schema: public; Owner: aksi_user
--

CREATE INDEX "photos_orderItemId_idx" ON public.photos USING btree ("orderItemId");


--
-- TOC entry 3363 (class 1259 OID 60235)
-- Name: price_list_items_categoryId_catalogNumber_name_key; Type: INDEX; Schema: public; Owner: aksi_user
--

CREATE UNIQUE INDEX "price_list_items_categoryId_catalogNumber_name_key" ON public.price_list_items USING btree ("categoryId", "catalogNumber", name);


--
-- TOC entry 3364 (class 1259 OID 60234)
-- Name: price_list_items_categoryId_idx; Type: INDEX; Schema: public; Owner: aksi_user
--

CREATE INDEX "price_list_items_categoryId_idx" ON public.price_list_items USING btree ("categoryId");


--
-- TOC entry 3365 (class 1259 OID 60252)
-- Name: price_list_items_categoryId_jsonId_key; Type: INDEX; Schema: public; Owner: aksi_user
--

CREATE UNIQUE INDEX "price_list_items_categoryId_jsonId_key" ON public.price_list_items USING btree ("categoryId", "jsonId");


--
-- TOC entry 3366 (class 1259 OID 60251)
-- Name: price_list_items_jsonId_idx; Type: INDEX; Schema: public; Owner: aksi_user
--

CREATE INDEX "price_list_items_jsonId_idx" ON public.price_list_items USING btree ("jsonId");


--
-- TOC entry 3360 (class 1259 OID 60233)
-- Name: service_categories_code_key; Type: INDEX; Schema: public; Owner: aksi_user
--

CREATE UNIQUE INDEX service_categories_code_key ON public.service_categories USING btree (code);


--
-- TOC entry 3406 (class 1259 OID 60897)
-- Name: sessions_sessionToken_key; Type: INDEX; Schema: public; Owner: aksi_user
--

CREATE UNIQUE INDEX "sessions_sessionToken_key" ON public.sessions USING btree ("sessionToken");


--
-- TOC entry 3407 (class 1259 OID 60899)
-- Name: verification_tokens_identifier_token_key; Type: INDEX; Schema: public; Owner: aksi_user
--

CREATE UNIQUE INDEX verification_tokens_identifier_token_key ON public.verification_tokens USING btree (identifier, token);


--
-- TOC entry 3408 (class 1259 OID 60898)
-- Name: verification_tokens_token_key; Type: INDEX; Schema: public; Owner: aksi_user
--

CREATE UNIQUE INDEX verification_tokens_token_key ON public.verification_tokens USING btree (token);


--
-- TOC entry 3416 (class 2606 OID 60852)
-- Name: order_history order_history_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aksi_user
--

ALTER TABLE ONLY public.order_history
    ADD CONSTRAINT "order_history_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3411 (class 2606 OID 60787)
-- Name: order_items order_items_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aksi_user
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3412 (class 2606 OID 60865)
-- Name: order_items order_items_priceListItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aksi_user
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "order_items_priceListItemId_fkey" FOREIGN KEY ("priceListItemId") REFERENCES public.price_list_items(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3410 (class 2606 OID 60777)
-- Name: orders orders_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aksi_user
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "orders_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public.clients(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3413 (class 2606 OID 60792)
-- Name: payments payments_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aksi_user
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public.clients(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3414 (class 2606 OID 60797)
-- Name: payments payments_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aksi_user
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3415 (class 2606 OID 60870)
-- Name: photos photos_orderItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aksi_user
--

ALTER TABLE ONLY public.photos
    ADD CONSTRAINT "photos_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES public.order_items(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3409 (class 2606 OID 60246)
-- Name: price_list_items price_list_items_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aksi_user
--

ALTER TABLE ONLY public.price_list_items
    ADD CONSTRAINT "price_list_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.service_categories(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3580 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: aksi_user
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2025-04-11 20:55:33 CEST

--
-- PostgreSQL database dump complete
--


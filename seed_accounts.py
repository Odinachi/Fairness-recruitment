#!/usr/bin/env python3
"""
seed_accounts.py
Creates 10 recruiter accounts + 10 candidate accounts in Firebase.
Run from the project root: python3 seed_accounts.py
"""

import firebase_admin
from firebase_admin import credentials, auth, firestore
import datetime, sys

# Init using Application Default Credentials (gcloud login / service account)
try:
    app = firebase_admin.initialize_app(options={"projectId": "farmersdeck"})
except ValueError:
    app = firebase_admin.get_app()

db = firestore.client()

PASSWORD = "Jobnatics2025!"

RECRUITERS = [
    {
        "name": "Sarah Mitchell", "email": "sarah.mitchell@techvault.io",
        "company": "TechVault", "company_slug": "techvault",
        "title": "Head of Talent Acquisition", "location": "San Francisco, CA",
        "bio": "Building world-class engineering teams at TechVault. I look for passionate builders who ship fast and learn faster.",
        "company_data": {
            "logo": "⚡", "tagline": "Where Ideas Become Products",
            "description": "TechVault is a Series B AI infrastructure company building the next generation of developer tooling. We power over 2,000 engineering teams worldwide.",
            "industry": "AI / Developer Tools", "size": "51-200", "founded": "2021",
            "techStack": ["TypeScript","Python","Rust","Kubernetes","PostgreSQL"],
            "culture": ["Async-first","High ownership","No meetings before 10am"],
        },
        "jobs": [
            {"title":"Senior Backend Engineer","level":"Senior","remote":"remote","salary":"$160,000 - $200,000","salaryMin":160000,"salaryMax":200000,"skills":["Python","FastAPI","PostgreSQL","Redis"],"description":"We are looking for a Senior Backend Engineer to design and scale our core API infrastructure. You will work closely with the platform team to build highly available services handling millions of requests daily.","requirements":["5+ years backend experience","Strong Python skills","Experience with distributed systems","PostgreSQL expertise"],"benefits":["$5k hardware budget","Unlimited PTO","Full remote"]},
            {"title":"ML Engineer","level":"Mid-Level","remote":"remote","salary":"$140,000 - $180,000","salaryMin":140000,"salaryMax":180000,"skills":["Python","PyTorch","MLflow","Kubernetes"],"description":"Join our ML team to build and ship production models powering developer intelligence features. You will own model training, evaluation and deployment pipelines.","requirements":["3+ years ML engineering","PyTorch proficiency","MLOps experience","Strong Python"],"benefits":["Equity","Learning budget","Health insurance"]},
            {"title":"Frontend Engineer","level":"Senior","remote":"hybrid","salary":"$140,000 - $175,000","salaryMin":140000,"salaryMax":175000,"skills":["React","TypeScript","GraphQL","Storybook"],"description":"Own our developer-facing UI. You will shape the experience for thousands of engineers every day.","requirements":["4+ years frontend experience","React and TypeScript mastery","Design sensibility","Component library experience"],"benefits":["Equity","Remote flexibility","$1k home office"]},
            {"title":"DevOps Engineer","level":"Senior","remote":"remote","salary":"$155,000 - $195,000","salaryMin":155000,"salaryMax":195000,"skills":["Kubernetes","Terraform","AWS","Prometheus"],"description":"Own our cloud infrastructure and CI/CD pipelines. Drive reliability and scale for a fast-growing platform.","requirements":["5+ years DevOps/SRE","Kubernetes at scale","Terraform proficiency","AWS expertise"],"benefits":["Full remote","Equity","On-call bonus"]},
            {"title":"Security Engineer","level":"Senior","remote":"remote","salary":"$170,000 - $210,000","salaryMin":170000,"salaryMax":210000,"skills":["AppSec","SAST","Penetration Testing","AWS"],"description":"Lead application and infrastructure security across all products. Partner with engineering to build a secure-by-default culture.","requirements":["5+ years security engineering","OWASP knowledge","Cloud security expertise","Python scripting"],"benefits":["Top-of-market comp","Equity","Conference budget"]},
        ],
    },
    {
        "name": "James Okafor", "email": "james.okafor@novafintech.co",
        "company": "Nova Fintech", "company_slug": "nova-fintech",
        "title": "VP of Engineering Recruitment", "location": "New York, NY",
        "bio": "10 years recruiting top fintech engineers. I value rigorous thinkers who can operate under compliance constraints without losing velocity.",
        "company_data": {
            "logo": "💳", "tagline": "Financial Infrastructure for the Future",
            "description": "Nova Fintech builds compliant, high-throughput payment rails for neobanks and enterprise clients. Processing over $5B in annual transaction volume.",
            "industry": "Fintech / Payments", "size": "201-500", "founded": "2019",
            "techStack": ["Java","Kotlin","Go","Kafka","PostgreSQL"],
            "culture": ["Data-driven","Compliance-aware","Fast iteration"],
        },
        "jobs": [
            {"title":"Backend Engineer - Payments","level":"Senior","remote":"hybrid","salary":"$150,000 - $190,000","salaryMin":150000,"salaryMax":190000,"skills":["Java","Kafka","PostgreSQL","Spring Boot"],"description":"Own the transaction processing engine that handles millions of daily payments. Uptime and correctness are everything in financial services.","requirements":["5+ years Java","Kafka experience","High-throughput systems","PCI-DSS awareness"],"benefits":["Hybrid NYC","Equity","Annual bonus"]},
            {"title":"Go Engineer - Core Platform","level":"Mid-Level","remote":"remote","salary":"$130,000 - $165,000","salaryMin":130000,"salaryMax":165000,"skills":["Go","gRPC","PostgreSQL","Docker"],"description":"Join the core platform team building internal services that power Nova's financial products.","requirements":["3+ years Go","gRPC/protobuf","Strong systems thinking","PostgreSQL"],"benefits":["Full remote","401k match","Health insurance"]},
            {"title":"Data Engineer","level":"Mid-Level","remote":"remote","salary":"$120,000 - $155,000","salaryMin":120000,"salaryMax":155000,"skills":["Python","dbt","Snowflake","Airflow"],"description":"Build and maintain our financial data pipelines that power compliance reporting and product analytics.","requirements":["3+ years data engineering","dbt expertise","Snowflake or BigQuery","Airflow"],"benefits":["Remote","Learning stipend","Stock options"]},
            {"title":"Compliance Engineer","level":"Senior","remote":"hybrid","salary":"$145,000 - $180,000","salaryMin":145000,"salaryMax":180000,"skills":["Python","Regulatory Tech","SQL","APIs"],"description":"Bridge engineering and legal/compliance teams. Build tooling that keeps us ahead of regulatory changes.","requirements":["Knowledge of financial regulations","4+ years software engineering","Python","Cross-functional leadership"],"benefits":["Hybrid","Equity","Annual bonus"]},
            {"title":"Mobile Engineer - iOS","level":"Senior","remote":"remote","salary":"$140,000 - $175,000","salaryMin":140000,"salaryMax":175000,"skills":["Swift","SwiftUI","Xcode","REST APIs"],"description":"Build the iOS app experience for our consumer neobanking product used by 500k customers.","requirements":["5+ years iOS","SwiftUI proficiency","App Store experience","Fintech domain a plus"],"benefits":["Remote","Equity","Device budget"]},
        ],
    },
    {
        "name": "Priya Nair", "email": "priya.nair@healthloomai.com",
        "company": "HealthLoom AI", "company_slug": "healthloom-ai",
        "title": "Director of Technical Recruiting", "location": "Boston, MA",
        "bio": "Passionate about building health-tech teams that combine clinical empathy with engineering excellence.",
        "company_data": {
            "logo": "🏥", "tagline": "AI That Saves Lives",
            "description": "HealthLoom AI develops FDA-cleared clinical decision support tools powered by large language models. Deployed in 300+ hospitals across the US.",
            "industry": "Health Tech / AI", "size": "51-200", "founded": "2020",
            "techStack": ["Python","React","FastAPI","AWS","PostgreSQL"],
            "culture": ["Mission-driven","Research-grade engineering","Regulatory-aware"],
        },
        "jobs": [
            {"title":"Full Stack Engineer - Clinical UI","level":"Senior","remote":"hybrid","salary":"$145,000 - $185,000","salaryMin":145000,"salaryMax":185000,"skills":["React","TypeScript","Python","FastAPI"],"description":"Build clinical decision tools used by physicians in high-stakes environments. Latency and reliability are patient safety issues.","requirements":["5+ years full stack","React/TypeScript expertise","Experience in regulated industries","Strong UX sensibility"],"benefits":["Mission-driven work","Equity","Hybrid Boston"]},
            {"title":"AI / NLP Engineer","level":"Senior","remote":"remote","salary":"$160,000 - $200,000","salaryMin":160000,"salaryMax":200000,"skills":["Python","PyTorch","Transformers","Clinical NLP"],"description":"Build and finetune LLMs for clinical note parsing, ICD coding, and diagnostic suggestion engines.","requirements":["5+ years NLP/ML","Transformer architecture expertise","Healthcare domain a plus","Production ML experience"],"benefits":["Equity","Remote","Research publication encouraged"]},
            {"title":"Backend Engineer - Data Pipeline","level":"Mid-Level","remote":"remote","salary":"$125,000 - $160,000","salaryMin":125000,"salaryMax":160000,"skills":["Python","Apache Spark","AWS","Kafka"],"description":"Ingest and process clinical EHR data at scale. Build reliable pipelines that feed our AI models.","requirements":["3+ years data engineering","Spark experience","AWS proficiency","HL7/FHIR a plus"],"benefits":["Remote","401k","Health insurance"]},
            {"title":"Security and Compliance Engineer","level":"Senior","remote":"hybrid","salary":"$150,000 - $190,000","salaryMin":150000,"salaryMax":190000,"skills":["HIPAA","Cloud Security","Python","Penetration Testing"],"description":"Own our HIPAA and SOC2 compliance posture. Work with engineering and legal to keep patient data safe.","requirements":["HIPAA expertise","5+ years security","Cloud security","Pen testing background"],"benefits":["Hybrid","Equity","Conference budget"]},
            {"title":"QA Automation Engineer","level":"Mid-Level","remote":"remote","salary":"$100,000 - $130,000","salaryMin":100000,"salaryMax":130000,"skills":["Playwright","Python","CI/CD","Test Planning"],"description":"Build automated test suites for FDA-regulated software. Own test plans and release validation processes.","requirements":["3+ years QA automation","Playwright or Cypress","Regulated software experience","Python scripting"],"benefits":["Remote","Learning stipend","Health insurance"]},
        ],
    },
    {
        "name": "Lucas Fernandez", "email": "lucas.fernandez@stormcloud.dev",
        "company": "StormCloud", "company_slug": "stormcloud",
        "title": "Engineering Recruiter", "location": "Austin, TX",
        "bio": "Recruiting at StormCloud, a fast-growing cloud infra startup. I care deeply about culture fit and love finding underestimated talent.",
        "company_data": {
            "logo": "⛈️", "tagline": "Infrastructure You Can Trust",
            "description": "StormCloud provides managed Kubernetes and observability solutions for enterprise clients. Used by over 500 companies to run critical workloads.",
            "industry": "Cloud Infrastructure", "size": "51-200", "founded": "2020",
            "techStack": ["Go","Kubernetes","Prometheus","Grafana","Terraform"],
            "culture": ["Remote-first","Open source friendly","Documentation-driven"],
        },
        "jobs": [
            {"title":"Site Reliability Engineer","level":"Senior","remote":"remote","salary":"$155,000 - $195,000","salaryMin":155000,"salaryMax":195000,"skills":["Kubernetes","Go","Prometheus","Terraform"],"description":"Own reliability for a multi-tenant Kubernetes platform serving Fortune 500 customers. Define SLOs and run oncall.","requirements":["5+ years SRE/DevOps","Kubernetes operator experience","Go proficiency","Terraform"],"benefits":["Remote","Equity","On-call compensation"]},
            {"title":"Go Platform Engineer","level":"Mid-Level","remote":"remote","salary":"$130,000 - $165,000","salaryMin":130000,"salaryMax":165000,"skills":["Go","gRPC","etcd","Docker"],"description":"Build internal platform tooling and CLIs that thousands of engineers use daily.","requirements":["3+ years Go","Strong distributed systems knowledge","API design","Open source contributions a plus"],"benefits":["Remote","OSS time","Stock options"]},
            {"title":"Technical Writer / DevRel Engineer","level":"Mid-Level","remote":"remote","salary":"$100,000 - $130,000","salaryMin":100000,"salaryMax":130000,"skills":["Technical Writing","Kubernetes","Developer Relations","APIs"],"description":"Write world-class docs, tutorials, and blog posts. Be the voice of StormCloud to the developer community.","requirements":["3+ years technical writing or DevRel","Kubernetes knowledge","Strong written communication","Community engagement"],"benefits":["Remote","Conference speaking budget","Flexible hours"]},
            {"title":"Sales Engineer","level":"Senior","remote":"hybrid","salary":"$140,000 - $180,000","salaryMin":140000,"salaryMax":180000,"skills":["Kubernetes","Sales Engineering","Cloud","Communication"],"description":"Work with enterprise sales to close technical deals. Demo the platform, answer RFPs, and build POCs.","requirements":["4+ years sales engineering","Kubernetes expertise","Enterprise customer experience","Excellent communication"],"benefits":["Base + commission","Equity","Hybrid"]},
            {"title":"Enterprise Support Engineer","level":"Mid-Level","remote":"remote","salary":"$95,000 - $125,000","salaryMin":95000,"salaryMax":125000,"skills":["Kubernetes","Linux","Debugging","Customer Communication"],"description":"Provide technical support to enterprise Kubernetes customers. Diagnose issues and write runbooks.","requirements":["2+ years support engineering","Strong Kubernetes knowledge","Linux debugging","Customer empathy"],"benefits":["Remote","401k match","Health insurance"]},
        ],
    },
    {
        "name": "Amara Diallo", "email": "amara.diallo@greenlinktech.org",
        "company": "GreenLink Tech", "company_slug": "greenlink-tech",
        "title": "Talent Partner - Engineering", "location": "Seattle, WA",
        "bio": "Recruiting for a climate tech company building the power grid of the future. I look for engineers who want to work on things that matter.",
        "company_data": {
            "logo": "🌿", "tagline": "Powering the Energy Transition",
            "description": "GreenLink Tech builds software for renewable energy grid management. Our platform coordinates wind, solar, and storage across 15 states.",
            "industry": "Climate Tech / Energy", "size": "51-200", "founded": "2018",
            "techStack": ["Python","React","TimescaleDB","MQTT","Kubernetes"],
            "culture": ["Mission-driven","Work-life balance","Long-term thinking"],
        },
        "jobs": [
            {"title":"Senior Python Engineer - Grid Intelligence","level":"Senior","remote":"remote","salary":"$145,000 - $185,000","salaryMin":145000,"salaryMax":185000,"skills":["Python","TimescaleDB","FastAPI","MQTT"],"description":"Build the algorithms that optimize energy dispatch across renewable assets in real time.","requirements":["5+ years Python","Time-series databases","Energy or IoT domain a plus","Distributed systems"],"benefits":["Remote","Mission-driven","Stock options"]},
            {"title":"Embedded IoT Engineer","level":"Mid-Level","remote":"hybrid","salary":"$120,000 - $155,000","salaryMin":120000,"salaryMax":155000,"skills":["C++","Embedded Linux","MQTT","Modbus"],"description":"Program firmware that runs on edge devices monitoring solar inverters and battery storage systems.","requirements":["3+ years embedded engineering","MQTT protocol","Modbus/IEC 61850","Embedded Linux"],"benefits":["Hybrid Seattle","Hardware budget","Meaningful work"]},
            {"title":"Data Scientist - Forecasting","level":"Senior","remote":"remote","salary":"$135,000 - $170,000","salaryMin":135000,"salaryMax":170000,"skills":["Python","Prophet","XGBoost","Energy Markets"],"description":"Build energy generation and price forecasting models that power automated grid decisions.","requirements":["4+ years data science","Forecasting models","Python/scikit-learn","Energy market knowledge a plus"],"benefits":["Remote","Research time","Equity"]},
            {"title":"Frontend Engineer - Operator Dashboard","level":"Mid-Level","remote":"remote","salary":"$115,000 - $145,000","salaryMin":115000,"salaryMax":145000,"skills":["React","TypeScript","D3.js","WebSockets"],"description":"Build real-time grid operator dashboards displaying live energy flows, alarms, and device status.","requirements":["3+ years React","D3.js or Recharts","WebSocket/real-time data","Strong UX thinking"],"benefits":["Remote","Equity","Flexible hours"]},
            {"title":"Infrastructure Engineer","level":"Senior","remote":"remote","salary":"$140,000 - $175,000","salaryMin":140000,"salaryMax":175000,"skills":["Kubernetes","Terraform","AWS","TimescaleDB"],"description":"Own the cloud infrastructure running our mission-critical grid management software.","requirements":["5+ years DevOps/infra","Kubernetes","AWS","Database administration"],"benefits":["Remote","Equity","Climate impact"]},
        ],
    },
    {
        "name": "Oliver Thompson", "email": "oliver.thompson@nexusdata.ai",
        "company": "Nexus Data", "company_slug": "nexus-data",
        "title": "Senior Technical Recruiter", "location": "Chicago, IL",
        "bio": "Nexus Data is building the data fabric for enterprise AI. I recruit ML engineers and data platform builders who love hard technical problems.",
        "company_data": {
            "logo": "🔷", "tagline": "Your Enterprise AI Data Platform",
            "description": "Nexus Data provides a unified data platform for enterprise AI teams, cataloguing, governing, and serving petabytes of training data to ML pipelines.",
            "industry": "Data / Enterprise AI", "size": "201-500", "founded": "2017",
            "techStack": ["Spark","dbt","Python","Scala","Snowflake"],
            "culture": ["Data-centric","Customer-obsessed","Structured thinking"],
        },
        "jobs": [
            {"title":"Data Platform Engineer","level":"Senior","remote":"remote","salary":"$150,000 - $190,000","salaryMin":150000,"salaryMax":190000,"skills":["Apache Spark","dbt","Snowflake","Python"],"description":"Build and maintain the core data platform serving 200+ enterprise AI teams with petabyte-scale datasets.","requirements":["5+ years data engineering","Spark at scale","dbt expertise","Snowflake/BigQuery"],"benefits":["Remote","Equity","Annual bonus"]},
            {"title":"ML Infrastructure Engineer","level":"Senior","remote":"remote","salary":"$160,000 - $200,000","salaryMin":160000,"salaryMax":200000,"skills":["Python","Kubeflow","MLflow","GPU Clusters"],"description":"Build training infrastructure that enables enterprise ML teams to iterate 10x faster on massive models.","requirements":["5+ years ML infra","Kubeflow/Airflow","GPU cluster management","MLOps expertise"],"benefits":["Remote","Top-of-market equity","GPU access"]},
            {"title":"Backend Engineer - Data API","level":"Mid-Level","remote":"remote","salary":"$130,000 - $165,000","salaryMin":130000,"salaryMax":165000,"skills":["Python","FastAPI","gRPC","PostgreSQL"],"description":"Build the APIs that enterprise customers use to query, annotate, and export training datasets.","requirements":["3+ years backend","FastAPI or Django","gRPC","Strong Python"],"benefits":["Remote","Stock options","Learning budget"]},
            {"title":"Analytics Engineer","level":"Mid-Level","remote":"hybrid","salary":"$110,000 - $140,000","salaryMin":110000,"salaryMax":140000,"skills":["dbt","SQL","Snowflake","Looker"],"description":"Own the analytics layer powering customer-facing dashboards and internal BI tooling.","requirements":["3+ years analytics engineering","dbt proficiency","SQL mastery","Looker/Metabase"],"benefits":["Hybrid Chicago","401k match","Health insurance"]},
            {"title":"Solutions Architect","level":"Senior","remote":"hybrid","salary":"$155,000 - $195,000","salaryMin":155000,"salaryMax":195000,"skills":["Enterprise Architecture","Data Platform","Python","Cloud"],"description":"Work with Fortune 500 clients to design Nexus Data deployments. Bridge sales and engineering.","requirements":["5+ years solutions architecture","Data platform expertise","Enterprise customer experience","Strong communication"],"benefits":["Hybrid","High base + bonus","Equity"]},
        ],
    },
    {
        "name": "Yuki Tanaka", "email": "yuki.tanaka@edgecraft.io",
        "company": "EdgeCraft", "company_slug": "edgecraft",
        "title": "Recruiting Lead", "location": "Los Angeles, CA",
        "bio": "Recruiting engineers for EdgeCraft's edge computing platform. I believe great engineering is also great writing.",
        "company_data": {
            "logo": "🔵", "tagline": "Compute at the Speed of Reality",
            "description": "EdgeCraft deploys software-defined compute infrastructure to the network edge, enabling sub-10ms latency applications for AR, gaming, and IoT.",
            "industry": "Edge Computing / Infrastructure", "size": "51-200", "founded": "2022",
            "techStack": ["Rust","C++","Go","WebAssembly","Linux"],
            "culture": ["Deep technical culture","Zero-bloat engineering","Documentation first"],
        },
        "jobs": [
            {"title":"Rust Systems Engineer","level":"Senior","remote":"remote","salary":"$170,000 - $215,000","salaryMin":170000,"salaryMax":215000,"skills":["Rust","Systems Programming","Networking","Linux"],"description":"Build the core edge runtime in Rust. Performance and correctness are non-negotiable.","requirements":["5+ years systems programming","Rust expertise","Networking protocols","Linux internals"],"benefits":["Remote","Above-market equity","Open source time"]},
            {"title":"WebAssembly Runtime Engineer","level":"Senior","remote":"remote","salary":"$160,000 - $200,000","salaryMin":160000,"salaryMax":200000,"skills":["WebAssembly","Rust","C++","WASI"],"description":"Extend our WebAssembly runtime for edge workloads. Integrate WASI standards and optimize cold-start performance.","requirements":["Deep Wasm knowledge","Rust or C++","WASI/WAMR experience","Performance optimization"],"benefits":["Remote","Equity","Research-friendly"]},
            {"title":"Network Engineer - Edge Fabric","level":"Senior","remote":"remote","salary":"$150,000 - $185,000","salaryMin":150000,"salaryMax":185000,"skills":["BGP","eBPF","Linux Networking","Go"],"description":"Design and implement the software-defined networking layer connecting our global edge nodes.","requirements":["5+ years network engineering","BGP/OSPF","eBPF proficiency","Go scripting"],"benefits":["Remote","Equity","Annual offsite"]},
            {"title":"Developer Experience Engineer","level":"Mid-Level","remote":"remote","salary":"$120,000 - $155,000","salaryMin":120000,"salaryMax":155000,"skills":["SDKs","Developer Tooling","Rust","Documentation"],"description":"Build the SDKs, CLI tools, and docs that make deploying to EdgeCraft delightful for developers.","requirements":["3+ years developer tooling","SDK design","Strong technical writing","Rust a plus"],"benefits":["Remote","Open source contributions","Learning budget"]},
            {"title":"Performance QA Engineer","level":"Mid-Level","remote":"remote","salary":"$110,000 - $145,000","salaryMin":110000,"salaryMax":145000,"skills":["Performance Testing","Rust","Linux","Benchmarking"],"description":"Build performance regression test suites and benchmarking harnesses for the EdgeCraft runtime.","requirements":["3+ years QA/performance engineering","Systems level profiling","Automated benchmarking","Rust exposure"],"benefits":["Remote","Flexible hours","Stock options"]},
        ],
    },
    {
        "name": "Fatima Al-Hassan", "email": "fatima.alhassan@quantumleap.tech",
        "company": "Quantum Leap", "company_slug": "quantum-leap",
        "title": "Engineering Talent Manager", "location": "London, UK",
        "bio": "Recruiting across Europe and US for Quantum Leap's quantum simulation software team. Looking for researchers who can also ship production code.",
        "company_data": {
            "logo": "⚛️", "tagline": "Simulating the Future",
            "description": "Quantum Leap builds hybrid classical-quantum simulation software used by pharma, materials science, and logistics companies to solve NP-hard optimisation problems.",
            "industry": "Quantum Computing / R&D Software", "size": "11-50", "founded": "2021",
            "techStack": ["Python","Qiskit","Julia","C++","CUDA"],
            "culture": ["Academic rigor with startup speed","Research-first","Remote-first"],
        },
        "jobs": [
            {"title":"Quantum Software Engineer","level":"Senior","remote":"remote","salary":"$120,000 - $160,000","salaryMin":120000,"salaryMax":160000,"skills":["Qiskit","Python","Quantum Algorithms","Julia"],"description":"Implement and optimise quantum circuits for hybrid classical-quantum algorithms. Work closely with quantum physicists.","requirements":["PhD or MSc in physics/CS preferred","Qiskit or Cirq","Strong Python/Julia","Variational quantum algorithms"],"benefits":["Remote","Research culture","Conference budget"]},
            {"title":"HPC CUDA Engineer","level":"Senior","remote":"remote","salary":"$115,000 - $150,000","salaryMin":115000,"salaryMax":150000,"skills":["CUDA","C++","HPC","GPU Programming"],"description":"Accelerate classical simulation fallbacks and tensor contraction algorithms on GPU clusters.","requirements":["5+ years CUDA/C++","HPC architecture","GPU memory optimization","MPI proficiency"],"benefits":["Remote","Publication support","GPU access"]},
            {"title":"Python SDK Engineer","level":"Mid-Level","remote":"remote","salary":"$90,000 - $120,000","salaryMin":90000,"salaryMax":120000,"skills":["Python","API Design","NumPy","Scientific Python"],"description":"Build the Python SDK that quantum researchers and enterprise clients use to interface with our simulation backend.","requirements":["3+ years Python SDK development","Scientific Python stack","Good API design taste","Documentation skills"],"benefits":["Remote","Flexible hours","Equity"]},
            {"title":"Research Engineer - Optimisation","level":"Senior","remote":"remote","salary":"$120,000 - $155,000","salaryMin":120000,"salaryMax":155000,"skills":["Operations Research","Python","Quantum Annealing","Linear Programming"],"description":"Apply quantum-inspired optimisation to logistics and scheduling problems for enterprise clients.","requirements":["Strong optimisation background","OR-Tools or similar","Python","Quantum interest"],"benefits":["Remote","Publication encouraged","Stock options"]},
            {"title":"DevOps Engineer - Research Infrastructure","level":"Mid-Level","remote":"remote","salary":"$85,000 - $110,000","salaryMin":85000,"salaryMax":110000,"skills":["Kubernetes","Terraform","GCP","Jupyter"],"description":"Run the compute infrastructure that powers our researchers and customer quantum simulation jobs.","requirements":["3+ years DevOps","Kubernetes","GCP","Jupyter Hub management"],"benefits":["Remote","Small team","Meaningful work"]},
        ],
    },
    {
        "name": "Marcus Johnson", "email": "marcus.johnson@springboard.careers",
        "company": "Springboard Careers", "company_slug": "springboard-careers",
        "title": "Head of Talent", "location": "Atlanta, GA",
        "bio": "Building the future of online education at Springboard. We actively recruit from bootcamp and self-taught backgrounds.",
        "company_data": {
            "logo": "🎓", "tagline": "Launch Your Tech Career",
            "description": "Springboard Careers is an ed-tech platform with 80,000+ alumni. We provide mentored bootcamps in software engineering, data science, and UX design.",
            "industry": "Ed-Tech / Career Advancement", "size": "201-500", "founded": "2013",
            "techStack": ["Ruby on Rails","React","Python","PostgreSQL","AWS"],
            "culture": ["Learner-first","Diverse and inclusive","Impact-driven"],
        },
        "jobs": [
            {"title":"Full Stack Engineer - Rails and React","level":"Mid-Level","remote":"remote","salary":"$110,000 - $140,000","salaryMin":110000,"salaryMax":140000,"skills":["Ruby on Rails","React","PostgreSQL","AWS"],"description":"Build features on our core learning platform used by 80k students worldwide. Move fast and focus on impact.","requirements":["3+ years full stack","Rails experience","React proficiency","PostgreSQL"],"benefits":["Remote","Free bootcamp access","401k"]},
            {"title":"Data Engineer - Learning Analytics","level":"Mid-Level","remote":"remote","salary":"$105,000 - $135,000","salaryMin":105000,"salaryMax":135000,"skills":["Python","dbt","Redshift","Airflow"],"description":"Build the data pipelines powering our learner outcome tracking and mentor effectiveness analytics.","requirements":["3+ years data engineering","dbt","Redshift or Snowflake","Python"],"benefits":["Remote","Learning stipend","Health insurance"]},
            {"title":"Product Engineer - AI Mentor","level":"Senior","remote":"remote","salary":"$135,000 - $165,000","salaryMin":135000,"salaryMax":165000,"skills":["Python","LangChain","React","OpenAI API"],"description":"Build our AI mentor product that gives personalised code feedback and career guidance to learners.","requirements":["4+ years engineering","LLM API integration","Strong product instinct","Python + React"],"benefits":["Remote","Equity","Meaningful mission"]},
            {"title":"DevOps Engineer","level":"Mid-Level","remote":"remote","salary":"$110,000 - $140,000","salaryMin":110000,"salaryMax":140000,"skills":["AWS","Terraform","Docker","GitHub Actions"],"description":"Maintain and improve our AWS infrastructure. Automate deployments and keep the platform highly available.","requirements":["3+ years DevOps","AWS","Terraform","CI/CD pipelines"],"benefits":["Remote","401k match","Free courses"]},
            {"title":"UX Product Designer","level":"Mid-Level","remote":"remote","salary":"$95,000 - $125,000","salaryMin":95000,"salaryMax":125000,"skills":["Figma","User Research","Design Systems","Prototyping"],"description":"Design experiences that help people change their careers. Own end-to-end product design for core learning flows.","requirements":["3+ years product design","Figma expertise","User research skills","Bootcamp/ed-tech a plus"],"benefits":["Remote","Figma pro license","Mission-driven"]},
        ],
    },
    {
        "name": "Chen Wei", "email": "chen.wei@orbitmedia.com",
        "company": "Orbit Media", "company_slug": "orbit-media",
        "title": "Technical Recruiter", "location": "San Jose, CA",
        "bio": "Recruiting engineers for Orbit Media's streaming and ad-tech platform. I love finding candidates who bridge performance and product thinking.",
        "company_data": {
            "logo": "📡", "tagline": "Media Infrastructure at Global Scale",
            "description": "Orbit Media powers live streaming, video delivery, and programmatic advertising for 50+ broadcasters and streaming services with billions of monthly minutes served.",
            "industry": "Media Tech / Ad Tech", "size": "201-500", "founded": "2015",
            "techStack": ["Go","C++","Kafka","FFmpeg","React"],
            "culture": ["Scale-obsessed","Technically rigorous","Fast-paced"],
        },
        "jobs": [
            {"title":"Video Infrastructure Engineer","level":"Senior","remote":"hybrid","salary":"$155,000 - $195,000","salaryMin":155000,"salaryMax":195000,"skills":["C++","FFmpeg","Video Codecs","RTMP"],"description":"Own the video transcoding and delivery stack processing billions of minutes of live content each month.","requirements":["5+ years video engineering","FFmpeg expertise","Codec knowledge (H.264, AV1)","C++ proficiency"],"benefits":["Hybrid San Jose","Equity","Annual bonus"]},
            {"title":"Ad Tech Engineer - Real-Time Bidding","level":"Senior","remote":"remote","salary":"$150,000 - $185,000","salaryMin":150000,"salaryMax":185000,"skills":["Go","Kafka","OpenRTB","Redis"],"description":"Build the real-time bidding engine serving billions of ad impressions with sub-100ms decision latency.","requirements":["5+ years backend","RTB/OpenRTB knowledge","Go proficiency","Low-latency systems"],"benefits":["Remote","Equity","401k match"]},
            {"title":"Data Engineer - Audience Analytics","level":"Mid-Level","remote":"remote","salary":"$120,000 - $155,000","salaryMin":120000,"salaryMax":155000,"skills":["Python","Spark","ClickHouse","Kafka"],"description":"Build the real-time audience data pipelines that power targeting, recommendations, and advertiser reports.","requirements":["3+ years data engineering","Kafka","ClickHouse or Druid","Python/Spark"],"benefits":["Remote","Stock options","Learning stipend"]},
            {"title":"Frontend Engineer - Player and Dashboard","level":"Mid-Level","remote":"remote","salary":"$115,000 - $145,000","salaryMin":115000,"salaryMax":145000,"skills":["React","TypeScript","HLS.js","WebRTC"],"description":"Build the web player and broadcaster dashboard used by major streaming clients worldwide.","requirements":["3+ years frontend","Video player development","React/TypeScript","WebRTC a plus"],"benefits":["Remote","Equity","Streaming perks"]},
            {"title":"Platform SRE","level":"Senior","remote":"remote","salary":"$150,000 - $190,000","salaryMin":150000,"salaryMax":190000,"skills":["Kubernetes","Go","Prometheus","CDN"],"description":"Run reliability engineering for a globally distributed streaming platform. Design for 99.99% uptime.","requirements":["5+ years SRE","CDN architecture","Kubernetes","Go scripting"],"benefits":["Remote","On-call compensation","Equity"]},
        ],
    },
]

CANDIDATES = [
    {"name":"Alex Rivera","email":"alex.rivera.dev@gmail.com","title":"Senior Full Stack Engineer","location":"San Francisco, CA","bio":"Senior full stack engineer with 6 years of experience in React, TypeScript, Node.js and PostgreSQL. Previously at Stripe and Airbnb. Passionate about developer tooling and elegant API design.","workStyle":"Remote","roleLevel":"Senior","salaryRange":"$150k-$190k","relocation":"No","skills":["React","TypeScript","Node.js","PostgreSQL","GraphQL"]},
    {"name":"Maya Patel","email":"maya.patel.eng@outlook.com","title":"ML Engineer","location":"New York, NY","bio":"ML engineer focused on NLP and LLMs. 4 years of experience building production models at scale. Published research on transformer fine-tuning for low-resource languages.","workStyle":"Hybrid","roleLevel":"Mid-Level","salaryRange":"$130k-$160k","relocation":"Yes","skills":["Python","PyTorch","Hugging Face","MLflow","SQL"]},
    {"name":"Ethan Kowalski","email":"ethan.kow.dev@protonmail.com","title":"Backend Engineer","location":"Chicago, IL","bio":"Backend engineer specialising in Go and distributed systems. 5 years building high-throughput APIs and event-driven architectures. Former lead engineer at a Series A fintech.","workStyle":"Remote","roleLevel":"Senior","salaryRange":"$140k-$175k","relocation":"No","skills":["Go","gRPC","Kafka","PostgreSQL","Kubernetes"]},
    {"name":"Sofia Andersen","email":"sofia.andersen.work@gmail.com","title":"Data Engineer","location":"Seattle, WA","bio":"Data engineer with deep expertise in Spark, dbt, and Snowflake. 4 years building petabyte-scale pipelines for retail and e-commerce clients. Passionate about data quality and observability.","workStyle":"Hybrid","roleLevel":"Mid-Level","salaryRange":"$115k-$145k","relocation":"No","skills":["Python","Apache Spark","dbt","Snowflake","Airflow"]},
    {"name":"Kwame Asante","email":"kwame.asante.eng@gmail.com","title":"DevOps / SRE","location":"Austin, TX","bio":"DevOps engineer with 5 years of experience in Kubernetes, Terraform and cloud infrastructure. Ran oncall for a platform serving 10M daily users. Certified Kubernetes Administrator.","workStyle":"Remote","roleLevel":"Senior","salaryRange":"$145k-$185k","relocation":"Yes","skills":["Kubernetes","Terraform","AWS","Go","Prometheus"]},
    {"name":"Isabella Chen","email":"isabella.chen.ux@gmail.com","title":"Product Designer","location":"Los Angeles, CA","bio":"Product designer with 5 years in B2B SaaS and ed-tech. Expert in Figma, design systems, and user research. Previously led design for a product with 200k DAU.","workStyle":"Remote","roleLevel":"Senior","salaryRange":"$110k-$140k","relocation":"No","skills":["Figma","User Research","Design Systems","Prototyping","Accessibility"]},
    {"name":"Dmitri Volkov","email":"dmitri.volkov.systems@gmail.com","title":"Systems Engineer","location":"Boston, MA","bio":"Systems programmer with 7 years in C++ and Rust. Experience in embedded Linux, network programming, and high-performance computing. Contributed to open source Rust async runtime.","workStyle":"Remote","roleLevel":"Senior","salaryRange":"$160k-$200k","relocation":"Yes","skills":["Rust","C++","Linux","Networking","Embedded Systems"]},
    {"name":"Aisha Mensah","email":"aisha.mensah.data@yahoo.com","title":"Data Scientist","location":"Atlanta, GA","bio":"Data scientist with a PhD in Statistics and 3 years of industry experience. Specialise in forecasting, causal inference, and A/B testing. Built recommendation models at a major streaming platform.","workStyle":"Hybrid","roleLevel":"Senior","salaryRange":"$125k-$160k","relocation":"Yes","skills":["Python","R","XGBoost","causalml","SQL"]},
    {"name":"Ravi Shankar","email":"ravi.shankar.mobile@gmail.com","title":"iOS Engineer","location":"San Jose, CA","bio":"iOS engineer with 5 years building consumer apps with millions of users. Expert in Swift, SwiftUI, and Combine. Led the rebuild of a fintech app's core checkout flow.","workStyle":"Hybrid","roleLevel":"Senior","salaryRange":"$135k-$170k","relocation":"No","skills":["Swift","SwiftUI","Xcode","Combine","REST APIs"]},
    {"name":"Camille Dupont","email":"camille.dupont.fe@gmail.com","title":"Frontend Engineer","location":"Austin, TX","bio":"Frontend engineer with 4 years building complex React applications. Strong TypeScript and GraphQL skills. Contributor to open source component libraries. Passionate about performance, accessibility, and design systems.","workStyle":"Remote","roleLevel":"Mid-Level","salaryRange":"$110k-$140k","relocation":"No","skills":["React","TypeScript","GraphQL","CSS","Storybook"]},
]


def create_user_and_profile(email, name, role, profile_data):
    try:
        user = auth.create_user(email=email, password=PASSWORD, display_name=name)
        uid = user.uid
        print(f"       created new auth user")
    except auth.EmailAlreadyExistsError:
        user = auth.get_user_by_email(email)
        uid = user.uid
        print(f"       auth user already exists, reusing uid")

    doc_data = {
        "name": name, "email": email, "role": role,
        "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed={uid}",
        "profileSetupCompleted": True,
        **profile_data,
    }
    db.collection("users").document(uid).set(doc_data, merge=True)
    return uid


def create_company(uid, slug, company_data, location):
    doc = {
        "name": company_data.get("name",""),
        "logo": company_data.get("logo","🏢"),
        "tagline": company_data.get("tagline",""),
        "description": company_data.get("description",""),
        "industry": company_data.get("industry",""),
        "size": company_data.get("size",""),
        "founded": company_data.get("founded",""),
        "location": location,
        "website": "",
        "techStack": company_data.get("techStack",[]),
        "benefits": ["Health insurance","Equity","Remote-first","Learning budget"],
        "culture": company_data.get("culture",[]),
        "perks": [],
        "rating": 4.2, "reviews": 18,
        "postedBy": uid,
    }
    db.collection("companies").document(slug).set(doc, merge=True)


def create_job(uid, company_name, job):
    doc = {
        "title": job["title"],
        "company": company_name,
        "companyLogo": "",
        "location": job.get("location","Remote"),
        "remote": job.get("remote","remote"),
        "salary": job.get("salary","Competitive"),
        "salaryMin": job.get("salaryMin",0),
        "salaryMax": job.get("salaryMax",0),
        "type": "Full-time",
        "level": job.get("level","Mid-Level"),
        "posted": "1 day ago",
        "match": 0,
        "skills": job.get("skills",[]),
        "description": job.get("description",""),
        "requirements": job.get("requirements",[]),
        "benefits": job.get("benefits",["Health insurance","Equity"]),
        "applicants": 0,
        "category": "Engineering",
        "featured": False,
        "urgent": False,
        "companySize": "",
        "industry": "",
        "postedBy": uid,
        "postedAt": datetime.datetime.utcnow().isoformat(),
        "deadline": "Aug 31, 2025",
        "views": 0,
    }
    db.collection("jobs").add(doc)


print("=" * 62)
print("  Jobnatics AI — Account Seeder")
print("=" * 62)

print(f"\n  Password for all accounts: {PASSWORD}\n")
print("Creating RECRUITERS...\n")

for r in RECRUITERS:
    print(f"  [{r['email']}]")
    profile = {
        "role":"recruiter","title":r["title"],"company":r["company"],
        "location":r["location"],"bio":r["bio"],
        "hiringPriority":"Technical Depth","workStyle":"Hybrid","roleLevel":"Senior",
    }
    uid = create_user_and_profile(r["email"], r["name"], "recruiter", profile)
    cdata = {**r["company_data"], "name": r["company"]}
    create_company(uid, r["company_slug"], cdata, r["location"])
    for job in r["jobs"]:
        create_job(uid, r["company"], job)
    print(f"       company '{r['company']}' + {len(r['jobs'])} jobs created\n")

print("\nCreating CANDIDATES...\n")

for c in CANDIDATES:
    print(f"  [{c['email']}]")
    profile = {
        "role":"applicant","title":c["title"],"location":c["location"],"bio":c["bio"],
        "workStyle":c["workStyle"],"roleLevel":c["roleLevel"],
        "salaryRange":c["salaryRange"],"relocation":c["relocation"],
        "skills":c.get("skills",[]),"github":"","linkedin":"","website":"",
    }
    create_user_and_profile(c["email"], c["name"], "applicant", profile)
    print()

print("=" * 62)
print("  All 20 accounts created successfully!")
print("=" * 62)
print()
print(f"  Password: {PASSWORD}")
print()
print("RECRUITERS:")
for r in RECRUITERS:
    print(f"  {r['email']:45s}  ({r['company']})")
print()
print("CANDIDATES:")
for c in CANDIDATES:
    print(f"  {c['email']:45s}  ({c['title']})")

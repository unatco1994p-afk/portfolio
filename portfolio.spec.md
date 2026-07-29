# Specyfikacja i Plan Działania: Projekt Portfolio (GCP + GKE + Quarkus + Angular)

## 1. Cel i Założenia Projektu
Stworzenie i wdrożenie produkcyjnego portfolio i CV w oparciu o architekturę mikrousługową na Google Cloud Platform (GCP). 

Projekt ma pełnić rolę **wizytówki inżynierskiej / DevOps**, prezentującej pełny stack technologiczny, wzorce projektowe, konteneryzację, packaging w Helm oraz bezpieczne CI/CD z Workload Identity Federation w chmurze GCP.

### Kluczowe Decyzje Architektoniczne:
- **Struktura Kodu:** Monorepo (wszystko w jednym repozytorium git).
- **Backend:** Quarkus (Java) z danymi przechowywanymi statycznie w plikach JSON (brak kosztów bazy danych) + kompilacja **GraalVM Native Image** (ultra-niski RAM < 50MB, natychmiastowy start).
- **Frontend:** Angular serwowany z kontenera Nginx.
- **Packaging K8s:** **Helm Chart** do parametryzowania i wdrażania aplikacji na Kubernetes.
- **Hosting Kodu / CI-CD:** Repo na **GitHub** połączone z **GCP Cloud Build** za pomocą **Workload Identity Federation** (bez kluczy JSON).
- **Optymalizacja Kosztów:** GKE Autopilot lub węzły Spot, bez osobnej płatnej bazy Cloud SQL.
- **Lokalne Uruchamianie:** Łatwe środowisko deweloperskie via `quarkus dev` / `ng serve` oraz produkcyjne testy lokalne via `docker-compose`.

---

## 2. Struktura Repozytorium (Monorepo)

```text
portfolio/
├── backend/                  # Quarkus REST API (Java)
│   ├── src/main/resources/  # Pliki JSON (dane portfolio, projekty, cv)
│   ├── Dockerfile.native     # Multi-stage build GraalVM Native Image
│   └── pom.xml
├── frontend/                 # Angular SPA
│   ├── src/
│   ├── nginx.conf            # Konfiguracja Nginx do serwowania wybudowanego SPA
│   ├── Dockerfile
│   └── package.json
├── helm/                     # Helm Chart aplikacji
│   └── portfolio-chart/
│       ├── Chart.yaml
│       ├── values.yaml
│       └── templates/        # Deployment, Service, Ingress, ManagedCertificate
├── cloudbuild.yaml           # Pipeline CI/CD dla GCP Cloud Build
├── docker-compose.yaml       # Lokalne uruchamianie obu usług jednocześnie
└── portfolio.spec.md         # Specyfikacja i dokumentacja projektu
```

---

## 3. Odpowiedź na pytanie: Gdzie trzymać kod źródłowy? (GCP vs GitHub)

> **Ważna informacja o GCP Cloud Source Repositories (CSR):**
> Google Cloud posiadało natywną usługę *Cloud Source Repositories*, jednak Google oficjalnie wstrzymało jej rozwój i uniemożliwiło tworzenie nowych repozytoriów CSR dla nowych projektów/użytkowników.
> 
> **Rekomendowane rozwiązanie:** **GitHub** (publiczne lub prywatne repozytorium).
> 
> **Dlaczego GitHub jest najlepszym wyborem?**
> 1. Jest to natywne miejsce do prezentacji portfolio dla rekruterów i klientów.
> 2. Świetnie integruje się z **GCP Cloud Build** oraz **Workload Identity Federation** (Cloud Build automatycznie wyzwala pipeline przy pushu do GitHub).

---

## 4. Lokalne Środowisko Programistyczne (Local Dev)

Aplikacja musi dawać możliwość wygodnego tworzenia i testowania lokalnie w dwóch trybach:

### Tryb 1: Szybki Dev (Programowanie na żywo)
- **Backend:** `cd backend && ./mvnw quarkus:dev` (Hot-reload kodu i plików JSON na porcie 8080).
- **Frontend:** `cd frontend && npm start` (`ng serve` z proxy na backend `localhost:8080` na porcie 4200).

### Tryb 2: Lokalne Odzwierciedlenie Produkcji (Docker Compose)
- Uruchomienie komendą: `docker-compose up --build`
- Sprawdza działanie wybudowanego frontendu na Nginx oraz natywnej/JVM wersji Quarkusa w izolowanych kontenerach.

### Tryb 3: Lokalne Testy Helm (Opcjonalnie)
- Uruchomienie lokalnego klastra Kubernetes (Minikube / Kind / Docker Desktop K8s).
- Wdrożenie przygotowanego charta: `helm install portfolio ./helm/portfolio-chart`.

---

## 5. Krok po Kroku: Plan Działania (Roadmap)

### Faza 1: Inicjalizacja Monorepo i Aplikacji Lokalnej
1. Stworzenie struktury katalogów (`backend`, `frontend`, `helm`).
2. Wygenerowanie i konfiguracja projektu **Quarkus** (REST endpoints `/api/projects`, `/api/profile`, `/q/health`).
3. Przygotowanie struktur danych JSON w Quarkusie dla CV/projektów.
4. Wygenerowanie projektu **Angular** z czytelnym UI (Profile, Projekty, Doświadczenie, Formularz kontaktowy).
5. Konfiguracja proxy w Angularze do komunikacji z Quarkusem i stworzenie pliku `docker-compose.yaml`.
6. Weryfikacja działania lokalnego.

### Faza 2: Konteneryzacja i Przygotowanie Helm Charta
1. Stworzenie `Dockerfile.native` dla Quarkusa (multi-stage build z GraalVM / Mandrel).
2. Stworzenie `Dockerfile` dla Angulara (build node.js + serwowanie przez Nginx).
3. Stworzenie struktury **Helm Chart** w `helm/portfolio-chart`:
   - `deployment-backend.yaml` i `deployment-frontend.yaml`
   - `service-backend.yaml` i `service-frontend.yaml`
   - `ingress.yaml` (z obsługą SSL GCP)
   - `managed-certificate.yaml` (Google Managed Certificate dla domeny)
   - `values.yaml` z sparametryzowanymi obrazami z Artifact Registry.

### Faza 3: Konfiguracja GCP i Workload Identity Federation
1. Utworzenie projektu GCP oraz włączenie wymaganych API (`container.googleapis.com`, `artifactregistry.googleapis.com`, `cloudbuild.googleapis.com`).
2. Stworzenie repozytorium w **GCP Artifact Registry** dla obrazów Docker.
3. Utworzenie klastra **GKE** (Autopilot lub Standard z węzłami Spot).
4. Rezerwacja Statycznego Zewnętrznego Adresu IP w GCP (`gcloud compute addresses create`).
5. Skonfigurowanie **Workload Identity Federation** w GCP, aby powiązać repozytorium GitHub / Cloud Build z odpowiednią rolą GCP IAM (do wgrywania obrazów i deploying na GKE).

### Faza 4: Pipeline CI/CD w GCP Cloud Build
1. Napisanie pliku `cloudbuild.yaml`:
   - Step 1: Budowa obrazu natywnego Quarkus i push do Artifact Registry.
   - Step 2: Budowa obrazu Angular i push do Artifact Registry.
   - Step 3: Pobranie poświadczeń do klastra GKE.
   - Step 4: Wykonanie `helm upgrade --install portfolio ./helm/portfolio-chart` z nowymi tagami obrazów.
2. Połączenie repozytorium GitHub z Cloud Build (Cloud Build Trigger na push do `main`).

### Faza 5: Podpięcie Domeny, Certyfikat SSL i Finalna Weryfikacja
1. Skonfigurowanie rekordu A/AAAA w panelu Twojej domeny na statyczny IP z GCP.
2. Weryfikacja generowania certyfikatu SSL (`kubectl get managedcertificate`).
3. Testy końcowe wydajnościowe i Lighthouse.

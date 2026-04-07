-- AM CULTURISMO - PostgreSQL Schema (Security-Fixed)
-- Fixed: MySQL inline INDEX → proper CREATE INDEX
-- Fixed: LONGTEXT → TEXT (PostgreSQL compatible)
-- Added: UNIQUE constraints required for ON CONFLICT clauses
-- Added: token_blacklist table for secure JWT logout
-- Fixed: 2026-04-07

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(20) DEFAULT 'client' CHECK (role IN ('admin', 'client')),
  birth_date DATE,
  height_cm DECIMAL(5,2),
  initial_weight_kg DECIMAL(6,2),
  gender VARCHAR(20),
  phone VARCHAR(20),
  address VARCHAR(255),
  city VARCHAR(100),
  postal_code VARCHAR(20),
  profile_picture_url TEXT,
  training_history TEXT,
  injury_history TEXT,
  dietary_preferences TEXT,
  training_preferences TEXT,
  sleep_hours INT,
  physical_activity_level VARCHAR(50),
  smoking VARCHAR(10),
  alcohol VARCHAR(10),
  work_activity VARCHAR(100),
  shift_work BOOLEAN DEFAULT FALSE,
  intolerances TEXT,
  allergies TEXT,
  psychological_issues TEXT,
  joint_pain BOOLEAN DEFAULT FALSE,
  fracture_history TEXT,
  surgery_history TEXT,
  medications TEXT,
  cold_extremities BOOLEAN DEFAULT FALSE,
  leg_swelling BOOLEAN DEFAULT FALSE,
  cellulite BOOLEAN DEFAULT FALSE,
  hypothyroidism BOOLEAN DEFAULT FALSE,
  pcos BOOLEAN DEFAULT FALSE,
  multifollicular_ovary BOOLEAN DEFAULT FALSE,
  chronic_inflammation BOOLEAN DEFAULT FALSE,
  mood_swings BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP,
  password_reset_token VARCHAR(500),
  password_reset_expires TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_role ON users (role);

-- ============================================
-- TOKEN BLACKLIST (Secure logout / revocation)
-- ============================================

CREATE TABLE token_blacklist (
  id SERIAL PRIMARY KEY,
  jti VARCHAR(255) UNIQUE NOT NULL,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_token_blacklist_jti ON token_blacklist (jti);
CREATE INDEX idx_token_blacklist_expires ON token_blacklist (expires_at);

-- ============================================
-- SUBSCRIPTION & PAYMENT
-- ============================================

CREATE TABLE plans (
  id SERIAL PRIMARY KEY,
  client_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_name VARCHAR(100),
  duration_days INT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  price DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'EUR',
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_plans_client_id ON plans (client_id);
CREATE INDEX idx_plans_status ON plans (status);

CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  client_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id INT REFERENCES plans(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  payment_method VARCHAR(50),
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_client_id ON payments (client_id);
CREATE INDEX idx_payments_status ON payments (status);

-- ============================================
-- DAILY LOGGING
-- ============================================

CREATE TABLE daily_logs (
  id SERIAL PRIMARY KEY,
  client_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  weight_kg DECIMAL(6,2),
  resting_heart_rate INT,
  training_heart_rate INT,
  body_temperature DECIMAL(4,1),
  mood INT CHECK (mood >= 1 AND mood <= 10),
  stress INT CHECK (stress >= 1 AND stress <= 10),
  energy INT CHECK (energy >= 1 AND energy <= 10),
  sleep_quality INT CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
  hunger INT CHECK (hunger >= 1 AND hunger <= 10),
  sleep_time TIME,
  wakeup_time TIME,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(client_id, log_date)
);

CREATE INDEX idx_daily_logs_client_id ON daily_logs (client_id);
CREATE INDEX idx_daily_logs_log_date ON daily_logs (log_date);

-- ============================================
-- BODY MEASUREMENTS
-- ============================================

CREATE TABLE measurements (
  id SERIAL PRIMARY KEY,
  client_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  measurement_date DATE NOT NULL,
  week_number INT,
  petto_cm DECIMAL(5,2),
  braccio_sinistro_cm DECIMAL(5,2),
  braccio_destro_cm DECIMAL(5,2),
  vita_cm DECIMAL(5,2),
  coscia_sinistra_cm DECIMAL(5,2),
  coscia_destra_cm DECIMAL(5,2),
  total_cm DECIMAL(6,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(client_id, measurement_date)
);

CREATE INDEX idx_measurements_client_id ON measurements (client_id);
CREATE INDEX idx_measurements_date ON measurements (measurement_date);

-- Body fat tracking (Pliche)
CREATE TABLE body_fat_tracking (
  id SERIAL PRIMARY KEY,
  client_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  measurement_date DATE NOT NULL,
  week_number INT,
  gender VARCHAR(10),
  age INT,
  petto_mm DECIMAL(6,2),
  addome_mm DECIMAL(6,2),
  coscia_mm DECIMAL(6,2),
  tricipite_mm DECIMAL(6,2),
  sottoscapola_mm DECIMAL(6,2),
  medio_ascellare_mm DECIMAL(6,2),
  anca_mm DECIMAL(6,2),
  body_fat_percentage DECIMAL(5,2),
  body_density DECIMAL(6,4),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(client_id, measurement_date)
);

CREATE INDEX idx_body_fat_client_id ON body_fat_tracking (client_id);
CREATE INDEX idx_body_fat_date ON body_fat_tracking (measurement_date);

-- ============================================
-- WORKOUT & EXERCISE
-- ============================================

CREATE TABLE workouts (
  id SERIAL PRIMARY KEY,
  client_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  admin_id INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  week_number INT,
  phase VARCHAR(100),
  start_date DATE,
  end_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_workouts_client_id ON workouts (client_id);
CREATE INDEX idx_workouts_admin_id ON workouts (admin_id);

CREATE TABLE workout_exercises (
  id SERIAL PRIMARY KEY,
  workout_id INT NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  day_of_week VARCHAR(20),
  exercise_name VARCHAR(255),
  description TEXT,
  sets INT,
  reps INT,
  weight_kg DECIMAL(6,2),
  rest_seconds INT,
  intensity_technique VARCHAR(100),
  video_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_workout_exercises_id ON workout_exercises (workout_id);

CREATE TABLE workout_logs (
  id SERIAL PRIMARY KEY,
  client_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  mood INT CHECK (mood >= 1 AND mood <= 10),
  motivation INT CHECK (motivation >= 1 AND motivation <= 10),
  energy INT CHECK (energy >= 1 AND energy <= 10),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(client_id, log_date)
);

CREATE INDEX idx_workout_logs_client_id ON workout_logs (client_id);

-- ============================================
-- NUTRITION & FOOD
-- ============================================

CREATE TABLE foods (
  id SERIAL PRIMARY KEY,
  food_name VARCHAR(255) NOT NULL UNIQUE,
  category VARCHAR(100),
  calories_kcal INT,
  carbs_gr DECIMAL(6,2),
  protein_gr DECIMAL(6,2),
  fat_gr DECIMAL(6,2),
  fiber_gr DECIMAL(6,2),
  sugars_gr DECIMAL(6,2),
  portion_size VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_foods_category ON foods (category);
CREATE INDEX idx_foods_name ON foods (food_name);

CREATE TABLE meal_plans (
  id SERIAL PRIMARY KEY,
  client_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  admin_id INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  week_number INT,
  day_of_week VARCHAR(20),
  meal_type VARCHAR(50),
  meal_name VARCHAR(255),
  total_calories INT,
  total_carbs_gr DECIMAL(6,2),
  total_protein_gr DECIMAL(6,2),
  total_fat_gr DECIMAL(6,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_meal_plans_client_id ON meal_plans (client_id);

CREATE TABLE meal_plan_items (
  id SERIAL PRIMARY KEY,
  meal_plan_id INT NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,
  food_id INT NOT NULL REFERENCES foods(id) ON DELETE RESTRICT,
  serving_size VARCHAR(100),
  calories_kcal INT,
  carbs_gr DECIMAL(6,2),
  protein_gr DECIMAL(6,2),
  fat_gr DECIMAL(6,2)
);

CREATE TABLE food_logs (
  id SERIAL PRIMARY KEY,
  client_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  meal_type VARCHAR(50),
  food_id INT REFERENCES foods(id) ON DELETE SET NULL,
  serving_size VARCHAR(100),
  calories_kcal INT,
  carbs_gr DECIMAL(6,2),
  protein_gr DECIMAL(6,2),
  fat_gr DECIMAL(6,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_food_logs_client_id ON food_logs (client_id);
CREATE INDEX idx_food_logs_date ON food_logs (log_date);

-- ============================================
-- SUPPLEMENTS
-- ============================================

CREATE TABLE supplements (
  id SERIAL PRIMARY KEY,
  supplement_name VARCHAR(255) NOT NULL UNIQUE,
  category VARCHAR(100),
  description TEXT,
  dosage VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE supplement_protocols (
  id SERIAL PRIMARY KEY,
  client_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  admin_id INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  supplement_id INT NOT NULL REFERENCES supplements(id) ON DELETE RESTRICT,
  phase VARCHAR(100),
  start_date DATE,
  end_date DATE,
  current_dosage VARCHAR(100),
  days_per_week VARCHAR(100),
  timing VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_supplement_protocols_client_id ON supplement_protocols (client_id);

-- ============================================
-- FEMALE CYCLE TRACKING
-- ============================================

CREATE TABLE female_cycle_data (
  id SERIAL PRIMARY KEY,
  client_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cycle_day INT,
  phase VARCHAR(50),
  notes TEXT,
  dominant_hormone VARCHAR(100),
  insulin_sensitivity VARCHAR(50),
  fuel_at_rest VARCHAR(50),
  fuel_during_exercise VARCHAR(50),
  fat_storage VARCHAR(50),
  metabolic_rate VARCHAR(50),
  hunger_levels VARCHAR(50),
  blood_glucose VARCHAR(50),
  water_retention VARCHAR(50),
  muscle_growth VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_female_cycle_client_id ON female_cycle_data (client_id);

-- ============================================
-- CONTENT & BLOGS
-- ============================================

CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  admin_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image_url TEXT,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  view_count INT DEFAULT 0,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blogs_slug ON blogs (slug);
CREATE INDEX idx_blogs_status ON blogs (status);
CREATE INDEX idx_blogs_published_at ON blogs (published_at);

CREATE TABLE blog_comments (
  id SERIAL PRIMARY KEY,
  blog_id INT NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  client_id INT REFERENCES users(id) ON DELETE CASCADE,
  comment_text TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blog_comments_blog_id ON blog_comments (blog_id);

CREATE TABLE posture_videos (
  id SERIAL PRIMARY KEY,
  admin_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise_name VARCHAR(255),
  description TEXT,
  youtube_url TEXT,
  thumbnail_url TEXT,
  category VARCHAR(100),
  difficulty_level VARCHAR(50),
  duration_seconds INT,
  is_published BOOLEAN DEFAULT FALSE,
  view_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_posture_videos_exercise ON posture_videos (exercise_name);

-- ============================================
-- FORM SUBMISSION TRACKING
-- ============================================

CREATE TABLE form_submissions (
  id SERIAL PRIMARY KEY,
  client_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  form_type VARCHAR(100) NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45)
);

CREATE INDEX idx_form_submissions_client_form ON form_submissions (client_id, form_type);
CREATE INDEX idx_form_submissions_submitted_at ON form_submissions (submitted_at);

-- ============================================
-- INITIAL ASSESSMENT
-- ============================================

CREATE TABLE initial_assessments (
  id SERIAL PRIMARY KEY,
  client_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessment_date DATE NOT NULL,
  current_sport VARCHAR(100),
  past_sport VARCHAR(100),
  training_frequency VARCHAR(100),
  time_available_weekly VARCHAR(100),
  training_experience VARCHAR(100),
  training_location VARCHAR(100),
  current_sleep_hours INT,
  daily_water_intake VARCHAR(100),
  beverages TEXT,
  energy_crashes BOOLEAN,
  nervousness BOOLEAN,
  metabolism_speed VARCHAR(50),
  disliked_foods TEXT,
  food_preferences TEXT,
  general_health_status TEXT,
  medical_clearance BOOLEAN,
  liability_waiver_signed BOOLEAN,
  photo_release_authorized BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(client_id)
);

CREATE INDEX idx_initial_assessments_client_id ON initial_assessments (client_id);

-- ============================================
-- PROGRESS PHOTOS
-- ============================================

CREATE TABLE progress_photos (
  id SERIAL PRIMARY KEY,
  client_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  photo_date DATE NOT NULL,
  week_number INT,
  front_photo_url TEXT,
  back_photo_url TEXT,
  right_side_photo_url TEXT,
  left_side_photo_url TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_progress_photos_client_id ON progress_photos (client_id);
CREATE INDEX idx_progress_photos_date ON progress_photos (photo_date);

-- ============================================
-- BLOOD TEST TRACKING
-- ============================================

CREATE TABLE blood_tests (
  id SERIAL PRIMARY KEY,
  client_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  test_date DATE NOT NULL,
  test_type VARCHAR(100),
  parameter_name VARCHAR(255),
  value DECIMAL(10,2),
  unit VARCHAR(50),
  reference_range VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blood_tests_client_id ON blood_tests (client_id);
CREATE INDEX idx_blood_tests_date ON blood_tests (test_date);

-- ============================================
-- INTENSITY TECHNIQUES LIBRARY
-- ============================================

CREATE TABLE intensity_techniques (
  id SERIAL PRIMARY KEY,
  technique_name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  target_stimulus VARCHAR(100),
  best_for TEXT,
  cautions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- AUDIT LOG
-- ============================================

CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  admin_id INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  client_id INT REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100),
  entity_type VARCHAR(100),
  entity_id INT,
  changes JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_admin_id ON audit_logs (admin_id);
CREATE INDEX idx_audit_logs_client_id ON audit_logs (client_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs (created_at);

-- ============================================
-- COMPOSITE PERFORMANCE INDEXES
-- ============================================

CREATE INDEX idx_daily_logs_client_date ON daily_logs(client_id, log_date DESC);
CREATE INDEX idx_measurements_client_date ON measurements(client_id, measurement_date DESC);
CREATE INDEX idx_plans_client_dates ON plans(client_id, start_date, end_date);
CREATE INDEX idx_payments_client_date ON payments(client_id, created_at DESC);
CREATE INDEX idx_workout_logs_client_date ON workout_logs(client_id, log_date DESC);

-- ============================================
-- TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_update_timestamp BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER plans_update_timestamp BEFORE UPDATE ON plans FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER daily_logs_update_timestamp BEFORE UPDATE ON daily_logs FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER payments_update_timestamp BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER workouts_update_timestamp BEFORE UPDATE ON workouts FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER blogs_update_timestamp BEFORE UPDATE ON blogs FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER measurements_update_timestamp BEFORE UPDATE ON measurements FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER body_fat_update_timestamp BEFORE UPDATE ON body_fat_tracking FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================
-- VIEWS
-- ============================================

CREATE VIEW client_summary AS
SELECT
  u.id, u.email, u.first_name, u.last_name, u.profile_picture_url,
  (SELECT weight_kg FROM daily_logs WHERE client_id = u.id ORDER BY log_date DESC LIMIT 1) AS latest_weight,
  (SELECT COUNT(*) FROM daily_logs WHERE client_id = u.id) AS total_logs,
  (SELECT COUNT(*) FROM workouts WHERE client_id = u.id) AS total_workouts,
  (SELECT status FROM plans WHERE client_id = u.id ORDER BY created_at DESC LIMIT 1) AS latest_plan_status
FROM users WHERE role = 'client';

CREATE VIEW admin_client_stats AS
SELECT
  u.id, u.email, u.first_name, u.last_name,
  (SELECT COUNT(*) FROM daily_logs WHERE client_id = u.id) AS total_logs,
  (SELECT COUNT(*) FROM progress_photos WHERE client_id = u.id) AS photo_count,
  (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE client_id = u.id AND status = 'completed') AS total_revenue,
  (SELECT status FROM plans WHERE client_id = u.id ORDER BY created_at DESC LIMIT 1) AS current_plan_status
FROM users WHERE role = 'client';

-- ============================================
-- SEED DATA
-- ============================================

INSERT INTO intensity_techniques (technique_name, description, target_stimulus, best_for) VALUES
('Stripping (Drop Set)', 'Remove weight and continue reps immediately', 'Stress metabolico dominante con tensione iniziale elevata', 'Su macchine o esercizi sicuri'),
('Super Set', 'Due esercizi consecutivi senza pausa', 'Stress metabolico e congestione muscolare', 'Efficienza temporale e intensità'),
('Compound Set', 'Due esercizi sullo stesso gruppo muscolare da angoli diversi', 'Tensione, stress metabolico e danno strutturale', 'Incremento ipertrofie specifiche'),
('Jump Set', 'Alternanza di gruppi muscolari distanti con poco recupero', 'Migliora densità e condizionamento generale', 'Allenamenti full body'),
('Rest Pause', 'Serie al cedimento, pausa 10-15 secondi, continua', 'Mantiene carico elevato e tensione continua', 'Overload progressivo su esercizi base'),
('Partial Reps', 'Ripetizioni incomplete per prolungare la serie', 'Alta tensione nel range ridotto e tensione continua', 'Superamento plateaus'),
('Stretch Forzato', 'Mantenimento del muscolo in allungamento sotto carico', 'Danno muscolare e espansione sarcomerico', 'Nuove risposte ipertrofiche'),
('Contrazione di Picco', 'Contrazione massima mantenuta per alcuni secondi', 'Migliora connessione mente-muscolo', 'Precision training'),
('Isometrico', 'Mantenimento isometrico per 10-20 secondi', 'Alta tensione continua e stress metabolico', 'Eccentriche e concentriche'),
('Eccentriche (320)', 'Eccentrica 3s, concentrica 2s controllata', 'Danno e tensione elevati', 'Overload e strength building'),
('SuperSlow', 'Ripetizioni estremamente lente', 'Forte stress metabolico e tensione costante', 'TUT incremento significativo'),
('Doppio Impulso', 'Micro-stop e seconda contrazione durante ripetizione', 'Tensione e controllo motorio aumentati', 'Mind-muscle connection');

INSERT INTO foods (food_name, category, calories_kcal, carbs_gr, protein_gr, fat_gr) VALUES
('Agnello', 'Meat', 264, 0, 25, 21),
('Albume', 'Protein', 47, 0.8, 11, 0),
('Anelli di totano', 'Seafood', 45, 0.7, 9.5, 0.5),
('Avena Istantanea', 'Carbs', 389, 66, 17, 7),
('Pollo Petto', 'Meat', 165, 0, 31, 3.6),
('Manzo magro', 'Meat', 215, 0, 26, 12),
('Salmone', 'Seafood', 208, 0, 20, 13),
('Tonno al naturale', 'Seafood', 116, 0, 26, 1),
('Uova intere', 'Protein', 155, 1.1, 13, 11),
('Riso bianco cotto', 'Carbs', 130, 28, 2.7, 0.3),
('Patate dolci', 'Carbs', 86, 20, 1.6, 0.1),
('Broccoli', 'Vegetables', 34, 7, 2.8, 0.4),
('Spinaci', 'Vegetables', 23, 3.6, 2.9, 0.4),
('Olio di oliva', 'Fats', 884, 0, 0, 100),
('Mandorle', 'Fats', 579, 22, 21, 50),
('Ricotta magra', 'Dairy', 138, 3, 11, 8),
('Mozzarella', 'Dairy', 280, 2.2, 17, 22),
('Pane integrale', 'Carbs', 247, 41, 13, 4),
('Quinoa', 'Carbs', 368, 64, 14, 6),
('Greek yogurt 0%', 'Dairy', 59, 3.6, 10, 0.4);

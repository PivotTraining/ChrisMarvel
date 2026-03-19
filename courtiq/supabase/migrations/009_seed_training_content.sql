-- Seed training content: drills, recovery, and nutrition
-- Migration 009

-- ============================================================
-- DRILLS (content_type = 'drill')
-- ============================================================

INSERT INTO training_content
  (content_type, title, description, coaching_cue, category, difficulty, duration_minutes, equipment, video_url, image_url, age_restricted, min_age, is_featured, tags)
VALUES
  (
    'drill', 'Mikan Drill',
    'A classic finishing drill where you alternate layups from each side of the basket without letting the ball touch the ground. Builds touch and rhythm around the rim.',
    'Keep the ball high—never bring it below your chin between finishes.',
    'Finishing', 'Beginner', 10,
    ARRAY['basketball', 'hoop'],
    NULL, NULL, FALSE, NULL, TRUE,
    ARRAY['layups', 'finishing', 'fundamentals']
  ),
  (
    'drill', 'Pound Dribble Series',
    'Stationary ball-handling drill focusing on hard, low dribbles with each hand. Develops grip strength, control, and a feel for the ball.',
    'Pound the ball as hard as you can—the floor is your enemy.',
    'Ball Handling', 'Beginner', 10,
    ARRAY['basketball'],
    NULL, NULL, FALSE, NULL, FALSE,
    ARRAY['dribbling', 'ball handling', 'fundamentals']
  ),
  (
    'drill', 'Figure 8 Dribbles',
    'Weave the ball in a figure-8 pattern around and through your legs while stationary. Improves hand speed, coordination, and ambidexterity.',
    'Stay low in an athletic stance and keep your eyes up.',
    'Ball Handling', 'Beginner', 8,
    ARRAY['basketball'],
    NULL, NULL, FALSE, NULL, FALSE,
    ARRAY['dribbling', 'coordination', 'ball handling']
  ),
  (
    'drill', 'Crossover Combo',
    'Perform in-and-out, between-the-legs, and behind-the-back crossovers in sequence while advancing up the court. Builds live-game combo moves.',
    'Sell the first move before exploding into the second.',
    'Ball Handling', 'Intermediate', 15,
    ARRAY['basketball', 'cones'],
    NULL, NULL, FALSE, NULL, TRUE,
    ARRAY['dribbling', 'moves', 'ball handling']
  ),
  (
    'drill', 'Spot-Up Shooting',
    'Catch and shoot from five marked spots around the arc, focusing on footwork and a consistent release. Track makes out of 10 at each spot.',
    'Land in your shot before the ball arrives—feet set, hands ready.',
    'Shooting', 'Beginner', 15,
    ARRAY['basketball', 'hoop'],
    NULL, NULL, FALSE, NULL, FALSE,
    ARRAY['shooting', 'catch and shoot', 'footwork']
  ),
  (
    'drill', 'Free Throw Routine',
    'Practice a repeatable pre-shot routine and shoot sets of 10 free throws with a focus on rhythm and follow-through. Essential for late-game composure.',
    'Find your routine and never skip it—same breaths, same bounce, every time.',
    'Shooting', 'Beginner', 10,
    ARRAY['basketball', 'hoop'],
    NULL, NULL, FALSE, NULL, FALSE,
    ARRAY['free throws', 'shooting', 'routine']
  ),
  (
    'drill', '3-Point Circuit',
    'Move around seven three-point stations (corners, wings, top, slots) taking two shots at each before rotating. Simulates game-speed relocation.',
    'Sprint to the spot, gather your feet, then fire—don''t rush the release itself.',
    'Shooting', 'Intermediate', 20,
    ARRAY['basketball', 'hoop', 'cones'],
    NULL, NULL, FALSE, NULL, TRUE,
    ARRAY['three pointers', 'shooting', 'conditioning']
  ),
  (
    'drill', 'Pull-Up Jumper',
    'Attack off the dribble and pull up for a mid-range jumper from various angles. Focuses on deceleration, balance, and shooting off movement.',
    'Plant your inside foot hard to kill momentum before you rise.',
    'Shooting', 'Advanced', 20,
    ARRAY['basketball', 'hoop', 'cones'],
    NULL, NULL, FALSE, NULL, FALSE,
    ARRAY['mid-range', 'shooting', 'advanced moves']
  ),
  (
    'drill', 'Euro Step Finishes',
    'Drive baseline and execute euro-step finishes with both hands, alternating sides. Develops body control and the ability to avoid shot-blockers.',
    'Your first step should freeze the defender, your second step goes around them.',
    'Finishing', 'Intermediate', 15,
    ARRAY['basketball', 'hoop', 'cones'],
    NULL, NULL, FALSE, NULL, FALSE,
    ARRAY['euro step', 'finishing', 'footwork']
  ),
  (
    'drill', 'Closeout Drill',
    'Sprint from the paint to contest a shooter on the perimeter, then slide to recover on a drive. Trains the balance between closing out hard and staying under control.',
    'High hands, choppy feet—never fly past the shooter.',
    'Defense', 'Intermediate', 12,
    ARRAY['basketball', 'cones'],
    NULL, NULL, FALSE, NULL, FALSE,
    ARRAY['defense', 'closeouts', 'agility']
  ),
  (
    'drill', 'Slide & Recover',
    'Defensive sliding drill across the lane and back, emphasizing low hips and quick lateral movement. Builds the base for on-ball defense.',
    'Stay low—if your hips rise, you lose.',
    'Defense', 'Beginner', 10,
    ARRAY['cones'],
    NULL, NULL, FALSE, NULL, FALSE,
    ARRAY['defense', 'footwork', 'lateral quickness']
  ),
  (
    'drill', 'Chest Pass Wall Drill',
    'Stand 6-8 feet from a wall and deliver rapid chest passes, catching and releasing as quickly as possible. Builds passing accuracy and hand strength.',
    'Step into every pass and snap your wrists—thumbs should point down on the follow-through.',
    'Passing', 'Beginner', 8,
    ARRAY['basketball', 'wall'],
    NULL, NULL, FALSE, NULL, FALSE,
    ARRAY['passing', 'fundamentals', 'hand strength']
  ),
  (
    'drill', 'Skip Pass Series',
    'Practice cross-court skip passes to a partner or target from different positions. Develops the vision and zip needed to swing the ball against a zone defense.',
    'Throw off your back foot and aim chest-high at your target.',
    'Passing', 'Intermediate', 12,
    ARRAY['basketball', 'cones', 'partner'],
    NULL, NULL, FALSE, NULL, FALSE,
    ARRAY['passing', 'court vision', 'zone offense']
  ),
  (
    'drill', 'Suicide Sprints',
    'Full-court sprint intervals touching the near free-throw line, half court, far free-throw line, and far baseline. Builds game-speed endurance and mental toughness.',
    'Touch every line and drive through the last sprint—don''t coast.',
    'Conditioning', 'Intermediate', 15,
    ARRAY[]::TEXT[],
    NULL, NULL, FALSE, NULL, FALSE,
    ARRAY['conditioning', 'speed', 'endurance']
  ),
  (
    'drill', 'Defensive Shuffle Ladder',
    'Combine lateral shuffles, backpedals, and sprints through an agility ladder pattern. An advanced conditioning circuit that mirrors defensive rotations.',
    'Stay on the balls of your feet—flat feet are dead feet.',
    'Conditioning', 'Advanced', 20,
    ARRAY['agility ladder', 'cones'],
    NULL, NULL, FALSE, NULL, FALSE,
    ARRAY['conditioning', 'agility', 'defense']
  );

-- ============================================================
-- RECOVERY (content_type = 'recovery')
-- ============================================================

INSERT INTO training_content
  (content_type, title, description, coaching_cue, category, difficulty, duration_minutes, equipment, video_url, image_url, age_restricted, min_age, is_featured, tags)
VALUES
  (
    'recovery', 'Dynamic Warm-Up Routine',
    'A full-body warm-up sequence including high knees, butt kicks, leg swings, and arm circles to prepare joints and muscles for practice or a game.',
    'Move through each exercise with purpose—this is not a cool-down.',
    'Mobility', 'Beginner', 10,
    ARRAY[]::TEXT[],
    NULL, NULL, FALSE, NULL, TRUE,
    ARRAY['warm-up', 'mobility', 'pre-game']
  ),
  (
    'recovery', 'Post-Game Stretch Sequence',
    'A guided static stretching routine targeting hamstrings, quads, hip flexors, and shoulders. Hold each stretch for 30-45 seconds to promote recovery.',
    'Breathe deeply into each stretch—never bounce.',
    'Stretching', 'Beginner', 15,
    ARRAY['yoga mat'],
    NULL, NULL, FALSE, NULL, FALSE,
    ARRAY['stretching', 'cool-down', 'recovery']
  ),
  (
    'recovery', 'Hip Mobility Flow',
    'A focused sequence of hip openers including 90/90 sits, pigeon stretches, and leg swings. Essential for guards and forwards who rely on lateral quickness.',
    'Don''t force depth—work at the edge of your range and let it open up.',
    'Mobility', 'Intermediate', 12,
    ARRAY['yoga mat'],
    NULL, NULL, FALSE, NULL, FALSE,
    ARRAY['hips', 'mobility', 'flexibility']
  ),
  (
    'recovery', 'Ankle Stability Exercises',
    'Single-leg balance progressions and band-resisted ankle movements to bulletproof the ankle joint. Critical for players with a history of sprains.',
    'Start on a flat surface; progress to a balance pad only when you feel solid.',
    'Mobility', 'Beginner', 10,
    ARRAY['resistance band', 'balance pad'],
    NULL, NULL, FALSE, NULL, FALSE,
    ARRAY['ankles', 'stability', 'injury prevention']
  ),
  (
    'recovery', 'Foam Roller Recovery',
    'Self-myofascial release session targeting IT bands, quads, calves, and upper back. Helps reduce soreness and improve tissue quality between games.',
    'Roll slowly—when you hit a tender spot, pause and breathe through it for 20 seconds.',
    'Rest', 'Beginner', 15,
    ARRAY['foam roller'],
    NULL, NULL, FALSE, NULL, TRUE,
    ARRAY['foam rolling', 'recovery', 'soreness']
  ),
  (
    'recovery', 'Ice Bath Protocol',
    'Step-by-step guide to cold water immersion at 50-59 °F for 10-15 minutes. Reduces inflammation and speeds recovery after intense games or practices.',
    'Control your breathing on entry—slow exhales calm the shock response.',
    'Rest', 'Intermediate', 15,
    ARRAY['ice bath', 'thermometer', 'timer'],
    NULL, NULL, FALSE, NULL, FALSE,
    ARRAY['cold therapy', 'recovery', 'inflammation']
  ),
  (
    'recovery', 'Active Rest Day Plan',
    'A light-activity day plan including walking, gentle yoga, and mobility work to promote blood flow without taxing the body. Ideal between back-to-back game days.',
    'Keep your heart rate under 120 bpm—today is about recovery, not training.',
    'Rest', 'Beginner', 30,
    ARRAY['yoga mat'],
    NULL, NULL, FALSE, NULL, FALSE,
    ARRAY['rest day', 'active recovery', 'wellness']
  ),
  (
    'recovery', 'Sleep Optimization Guide',
    'Practical tips for improving sleep quality including room temperature, screen time limits, and pre-bed routines. Recovery starts with quality sleep.',
    'Set a consistent bedtime—your body clock is your best recovery tool.',
    'Rest', 'Beginner', 5,
    ARRAY[]::TEXT[],
    NULL, NULL, FALSE, NULL, FALSE,
    ARRAY['sleep', 'recovery', 'wellness']
  );

-- ============================================================
-- NUTRITION (content_type = 'nutrition')
-- ============================================================

INSERT INTO training_content
  (content_type, title, description, coaching_cue, category, difficulty, duration_minutes, equipment, video_url, image_url, age_restricted, min_age, is_featured, tags)
VALUES
  (
    'nutrition', 'Pre-Game Meal Plan',
    'A structured meal plan for 3-4 hours before tip-off, emphasizing complex carbs, lean protein, and low fat. Keeps energy steady without feeling heavy.',
    'Eat your big meal 3 hours out—a small snack 60 minutes before is fine.',
    'Pre-Game', 'Beginner', 5,
    ARRAY[]::TEXT[],
    NULL, NULL, FALSE, NULL, TRUE,
    ARRAY['meal plan', 'pre-game', 'energy']
  ),
  (
    'nutrition', 'Post-Workout Shake Guide',
    'Recipes for protein-packed recovery shakes using whey or plant protein, fruit, and simple carbs. Designed to kickstart muscle repair within 30 minutes of training.',
    'Hit the 3:1 carb-to-protein ratio for optimal recovery.',
    'Post-Game', 'Beginner', 5,
    ARRAY['blender', 'shaker bottle'],
    NULL, NULL, FALSE, NULL, FALSE,
    ARRAY['protein', 'post-workout', 'shakes']
  ),
  (
    'nutrition', 'Hydration Calculator',
    'Guidelines for calculating daily water intake based on body weight, activity level, and climate. Includes electrolyte replenishment strategies for heavy sweaters.',
    'If your urine isn''t pale yellow, you''re behind on fluids.',
    'Hydration', 'Beginner', 3,
    ARRAY[]::TEXT[],
    NULL, NULL, FALSE, NULL, FALSE,
    ARRAY['hydration', 'water', 'electrolytes']
  ),
  (
    'nutrition', 'Game Day Nutrition Timeline',
    'Hour-by-hour eating and hydration schedule from morning through post-game. Takes the guesswork out of fueling for competition.',
    'Front-load your calories early—don''t try to catch up at halftime.',
    'Pre-Game', 'Intermediate', 5,
    ARRAY[]::TEXT[],
    NULL, NULL, FALSE, NULL, FALSE,
    ARRAY['game day', 'meal timing', 'performance']
  ),
  (
    'nutrition', 'Healthy Snack Ideas for Athletes',
    'A curated list of portable, nutrient-dense snacks like trail mix, rice cakes with almond butter, and Greek yogurt parfaits. Perfect for between practices.',
    'Keep a snack in your bag—hunger is the enemy of focus.',
    'General', 'Beginner', 3,
    ARRAY[]::TEXT[],
    NULL, NULL, FALSE, NULL, FALSE,
    ARRAY['snacks', 'healthy eating', 'portable']
  ),
  (
    'nutrition', 'Protein-Rich Meal Prep',
    'Weekly meal prep guide featuring grilled chicken, salmon, eggs, and legumes paired with complex carbs. Saves time and keeps your nutrition consistent.',
    'Prep on Sunday, win all week—consistency beats perfection.',
    'General', 'Intermediate', 10,
    ARRAY[]::TEXT[],
    NULL, NULL, FALSE, NULL, FALSE,
    ARRAY['meal prep', 'protein', 'weekly plan']
  ),
  (
    'nutrition', 'Anti-Inflammatory Foods Guide',
    'A guide to foods that fight inflammation—berries, fatty fish, leafy greens, and turmeric. Helps reduce joint soreness and supports long-term joint health.',
    'Add one anti-inflammatory food to every meal—small changes add up.',
    'General', 'Beginner', 5,
    ARRAY[]::TEXT[],
    NULL, NULL, FALSE, NULL, FALSE,
    ARRAY['anti-inflammatory', 'joint health', 'nutrition']
  );

// JSON Output Schema for Nano Banana Pro & Veo 3.1
export const JSON_OUTPUT_SCHEMA = {
   type: "object",
   properties: {
      masterPrompt: {
         type: "object",
         description: "Nano Banana Pro master prompt for face/body/outfit consistency - NO POSE (pose is in keyframes only)",
         properties: {
            facePreservation: { type: "string", description: "CRITICAL: Face preservation instruction - must reference exact facial features from reference image" },
            subject: { type: "string", description: "Subject description with age, ethnicity, body type (NO face details here - use facePreservation)" },
            outfit: { type: "string", description: "Complete outfit with fabric materials (silk, denim, etc.)" },
            environment: { type: "string", description: "Real-world location (must be findable on Google Maps)" },
            lighting: { type: "string", description: "Lighting setup (cinematic, golden hour, Rembrandt, etc.)" },
            camera: { type: "string", description: "Camera angle and lens (medium shot, 85mm f/1.4, etc.)" },
            style: { type: "string", description: "Visual style (photorealistic fashion photography)" },
            voiceAnchor: {
               type: "object",
               description: "CRITICAL: Voice consistency anchor - SAME voice for ALL scenes. Veo 3.1 generates audio natively from prompt text.",
               properties: {
                  voice_profile: { type: "string", description: "Detailed voice description for Veo 3.1 audio generation. Must be identical across ALL scenes. E.g.: 'Young Vietnamese woman, 22-25 years old, Southern Saigon accent, warm and friendly tone'" },
                  vocal_characteristics: { type: "string", description: "Specific vocal traits: pitch (medium-high), speed (natural, slightly fast for energy), breathiness, clarity" },
                  accent_details: { type: "string", description: "Accent specifics: 'Southern Vietnamese (giọng miền Nam Sài Gòn) - soft consonants, melodic intonation, friendly casual register'" },
                  emotional_range: { type: "string", description: "Emotional baseline: 'Warm, enthusiastic, trustworthy - like talking to a close friend (chị em)'" }
               }
            }
         }
      },
      keyframes: {
         type: "array",
         description: "Nano Banana Pro keyframe prompts (static images). CRITICAL: Each keyframe MUST be a COMPLETE self-contained image prompt with ALL fields filled - do NOT rely on masterPrompt alone.",
         items: {
            type: "object",
            properties: {
               id: { type: "number" },
               timestamp: { type: "string", description: "Timestamp in video (00s, 08s, 16s...)" },
               subject: { type: "string", description: "Brief subject reference with 'exact facial features preserved from reference'" },
               action: { type: "string", description: "Current static pose/interaction (NOT motion). INCLUDE specific hand placement, body angle, expression" },
               environment: { type: "string", description: "REQUIRED - Specific location for THIS keyframe. Must include exact spot within the location (e.g., 'standing at marble fountain in hotel lobby' not just 'hotel lobby'). Derive from masterPrompt.environment but add SPECIFIC position/angle details for each frame" },
               backgroundPrompt: { type: "string", description: "Background-only prompt (no model) for pre-generating consistent backgrounds. Must derive from masterPrompt.environment with perspective shift per keyframe." },
               lighting: { type: "string", description: "REQUIRED - Lighting setup for THIS specific frame (e.g., 'warm golden hour side light with lens flare from left'). Can vary slightly per keyframe for visual interest" },
               camera: { type: "string", description: "REQUIRED - Camera angle AND lens for THIS frame (e.g., 'low angle full body, 35mm wide lens f/2.8' or 'close-up face, 85mm f/1.4 with shallow DOF'). MUST vary between keyframes for visual variety" },
               style: { type: "string", description: "Photorealistic style keywords + specific look for this frame" }
            }
         }
      },
      scenes: {
         type: "array",
         description: "Veo 3.1 scene prompts (motion between keyframes). CRITICAL: EVERY scene MUST have voiceConfig - not just Scene 1!",
         items: {
            type: "object",
            properties: {
               id: { type: "number" },
               timeRange: { type: "string", description: "Time range (00s-08s)" },
               shotType: { type: "string", description: "Shot type (tracking, drone, static...)" },
               subjectMotion: { type: "string", description: "What subject is doing (5-8 seconds). Include environment context for this scene" },
               cameraMotion: { type: "string", description: "Camera movement (pan, tilt, zoom, tracking...)" },
               atmosphere: { type: "string", description: "Mood, ambient motion, AND location atmosphere (sounds, lighting changes)" },
               startPose: { type: "string", description: "Pose at start (matches previous keyframe)" },
               endPose: { type: "string", description: "Pose at end (matches next keyframe)" },
               beatMarkers: { type: "array", description: "Beat timestamps within scene for pose snaps", items: { type: "string" } },
               beatActions: { type: "array", description: "Actions synced to each beatMarker", items: { type: "string" } },
               script: { type: "string", description: "Vietnamese script for this scene - REQUIRED if voiceStyle is not no_voice" },
               visualContinuityGuide: { type: "string", description: "How to maintain visual continuity from previous scene. E.g.: Use last frame of Scene N-1 as image reference (strength 0.6). Mode-specific: Linear Path / Multi-Angle / Fixed Stage." },
               voiceConfig: {
                  type: "object",
                  description: "⚠️ REQUIRED FOR EVERY SCENE (Scene 1, 2, 3... ALL). MUST copy voice_profile EXACTLY from masterPrompt.voiceAnchor.voice_profile. Do NOT skip voiceConfig for any scene!",
                  properties: {
                     voice_profile: { type: "string", description: "COPY EXACTLY from masterPrompt.voiceAnchor.voice_profile - IDENTICAL text for ALL scenes" },
                     vocal_tone: { type: "string", description: "Scene-specific emotional tone (excited/calm/urgent/intimate/playful) while keeping same voice" },
                     dialogue_style: { type: "string", description: "How character speaks: 'voiceover' (off-screen narration), 'lip-sync' (on-screen speaking with mouth movement), 'whisper' (soft intimate), 'exclaim' (excited announcement)" },
                     sync: { type: "string", description: "Audio-visual sync type: 'lip-sync' (model's mouth moves matching script - use when model faces camera) or 'voiceover' (off-screen narration - use for product close-ups or back shots). DEFAULT should be 'lip-sync' for scenes where model faces camera" }
                  }
               }
            }
         }
      },
      beatSync: {
         type: "object",
         description: "TikTok Auto-Cut Beat Synchronization - Optimized for REMIX music",
         properties: {
            bpm: { type: "number", description: "Beats per minute of the music (typically 120-160 for remix)" },
            beatPattern: { type: "string", description: "Beat pattern" },
            keyBeats: {
               type: "array",
               description: "Key beat timestamps for pose changes/cuts",
               items: {
                  type: "object",
                  properties: {
                     timestamp: { type: "string", description: "Beat timestamp" },
                     action: { type: "string", description: "Action type" },
                     intensity: { type: "string", description: "Intensity: 'soft', 'medium', 'hard', 'explosive'" }
                  }
               }
            },
            dropTimestamps: { type: "array", description: "Exact timestamps of bass drops", items: { type: "string" } },
            transitionStyle: { type: "string", description: "Cut transition style" },
            musicMood: { type: "string", description: "Music mood" }
         }
      },
      metadata: {
         type: "object",
         properties: {
            location: { type: "string", description: "Specific real-world location" },
            duration: { type: "number", description: "Total video duration in seconds" },
            aspectRatio: { type: "string", description: "9:16 or 16:9" },
            musicVibe: { type: "string", description: "Suggested music style with BPM range" },
            autoCutReady: { type: "boolean", description: "Whether poses are designed for TikTok auto-cut sync" },
            visualLogicType: { type: "string", description: "Background continuity mode: 'linear_progression' (Walk-In), 'multi_angle_editorial' (Standard), 'fixed_stage' (Transform), 'dynamic_vibe' (TikTok)" }
         }
      }
   }
};

// Movie Mode Schema - 2 PHÚT (120s) - N+1 KEYFRAME LOGIC
// 3 Chapters × 5 Scenes × 8s = 120s (2 minutes)
// Each chapter: 5 scenes → 6 keyframes (N+1)
// Total: 15 scenes, 18 keyframes
export const MOVIE_CHAPTER_SCHEMA = {
   type: "object",
   properties: {
      chapterInfo: {
         type: "object",
         description: "Chapter metadata and story context",
         properties: {
            chapterId: { type: "number", description: "Chapter number 1-3" },
            chapterName: { type: "string", description: "Setup, Confrontation, Resolution" },
            timeRange: { type: "string", description: "Time range: 0s-40s, 40s-80s, 80s-120s" },
            storyBeat: { type: "string", description: "Purpose of this chapter in the story" },
            emotionalArc: { type: "string", description: "Emotional progression" }
         }
      },
      masterPrompt: {
         type: "object",
         description: "Consistency anchor - MUST be identical across all 3 chapters",
         properties: {
            facePreservation: { type: "string", description: "CRITICAL: Face preservation - identical across chapters" },
            subject: { type: "string", description: "Subject description - identical across chapters" },
            outfit: { type: "string", description: "Outfit description - identical (unless Fashion Show template)" },
            colorGrading: { type: "string", description: "Color palette - consistent across chapters" },
            consistencyCheck: { type: "string", description: "Chapter X of 3 marker" }
         }
      },
      keyframes: {
         type: "array",
         description: "6 keyframes per chapter (N+1: 5 scenes → 6 keyframes)",
         items: {
            type: "object",
            properties: {
               id: { type: "number", description: "Global keyframe ID (1-18)" },
               timestamp: { type: "string", description: "Timestamp in movie (0s, 8s, 16s...)" },
               subject: { type: "string", description: "Brief subject reference with face preservation" },
               action: { type: "string", description: "Current static pose/interaction" },
               environment: { type: "string", description: "Location details for this moment" },
               lighting: { type: "string", description: "Lighting for this frame" },
               camera: { type: "string", description: "Camera angle and framing" },
               style: { type: "string", description: "Visual style keywords" }
            }
         }
      },
      scenes: {
         type: "array",
         description: "5 scenes per chapter (N+1: each scene connects 2 keyframes)",
         items: {
            type: "object",
            properties: {
               id: { type: "number", description: "Global scene ID" },
               timeRange: { type: "string", description: "Time range (e.g. 00s-08s)" },
               shotType: { type: "string", description: "Shot type (tracking, static, orbit...)" },
               subjectMotion: { type: "string", description: "What subject is doing" },
               cameraMotion: { type: "string", description: "Camera movement" },
               atmosphere: { type: "string", description: "Mood and ambient" },
               startPose: { type: "string", description: "Pose at start" },
               endPose: { type: "string", description: "Pose at end" }
            }
         }
      },
      transitionToNext: {
         type: "string",
         description: "Transition style to next chapter: FADE, CUT, MATCH, WHIP, ZOOM"
      }
   }
};

// Story Outline Schema (generated first, before chapters)
export const MOVIE_OUTLINE_SCHEMA = {
   type: "object",
   properties: {
      storyTemplate: { type: "string", description: "morning_to_night, transformation_epic, fashion_show, brand_story" },
      masterPrompt: {
         type: "object",
         description: "Master consistency anchor for entire movie",
         properties: {
            facePreservation: { type: "string", description: "CRITICAL: Exact face description for all chapters" },
            subject: { type: "string", description: "Subject description for all chapters" },
            outfit: { type: "string", description: "Complete outfit description" },
            colorGrading: { type: "string", description: "Color palette for entire movie" }
         }
      },
      chapterSummaries: {
         type: "array",
         description: "6 chapter summaries",
         items: {
            type: "object",
            properties: {
               chapterId: { type: "number" },
               chapterName: { type: "string" },
               timeRange: { type: "string" },
               setting: { type: "string", description: "Location/environment for this chapter" },
               storyBeat: { type: "string" },
               emotionalArc: { type: "string" },
               keyMoments: { type: "array", items: { type: "string" }, description: "3-4 key moments in this chapter" }
            }
         }
      },
      movieMetadata: {
         type: "object",
         properties: {
            totalDuration: { type: "number", description: "120 seconds (2 phút)" },
            totalKeyframes: { type: "number", description: "18 keyframes (N+1 logic)" },
            totalScenes: { type: "number", description: "15 scenes (5 per chapter)" },
            musicFlow: { type: "string", description: "Music structure across 3 chapters" }
         }
      }
   }
};

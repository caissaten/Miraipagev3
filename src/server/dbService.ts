import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { Novel, Chapter, Stats } from '../types';

// Establish paths
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');
const UPLOADS_DIR = path.resolve(DATA_DIR, 'uploads');

// Optional Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const useSupabase = !!(supabaseUrl && supabaseAnonKey);

const supabase = useSupabase ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Ensure directories exist (wrapped in try-catch to prevent crashing on read-only filesystems)
function ensureDirectories() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
  } catch (err) {
    console.warn("Could not ensure directories due to read-only filesystem:", err);
  }
}

// Initial seed data
const SEED_NOVELS: Novel[] = [
  {
    id: 'novel-1',
    title: 'The Shadow Librarian',
    slug: 'the-shadow-librarian',
    author: 'Aetheris',
    cover_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    synopsis: 'In a world where memories are stored as glowing crystal spheres inside the Forbidden Vaults, Arthur is a mere low-ranking scribe. But when he touches a rogue obsidian sphere, he gains the ability to walk through the shadow of memories. Now, hunted by the Grand Inquisitors, he must uncover the lost records of the first magic before the sky-city falls.',
    genre: ['Fantasy', 'Mystery', 'Magic', 'Kingdom'],
    tags: ['Overpowered', 'Secret Library', 'Slow Burn', 'Clever Protagonist'],
    status: 'Ongoing',
    views: 1240,
    featured: true,
    seo_title: 'The Shadow Librarian - Read Free Web Novel Online',
    seo_description: 'Read the latest chapters of The Shadow Librarian, a premium fantasy web novel of secret vaults, lost memories, and ancient shadows.',
    created_at: new Date('2026-06-15').toISOString(),
    updated_at: new Date('2026-06-27').toISOString(),
    published_at: new Date('2026-06-15').toISOString()
  },
  {
    id: 'novel-2',
    title: 'Reincarnated as a Mythical Dungeon Core',
    slug: 'reincarnated-as-a-mythical-dungeon-core',
    author: 'Vesper_Wind',
    cover_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    synopsis: 'Waking up in a dark, humid cavern with nothing but a floating blue status window, Alex realizes he has been turned into a circular sapphire crystal embedded in the rock. As a Mythical-grade Dungeon Core, he must design traps, summon mythical beasts, and expand his domain down into the deep core of the world while repelling greedy adventurers.',
    genre: ['Fantasy', 'Adventure', 'Kingdom', 'Action'],
    tags: ['Reincarnation', 'LitRPG', 'Base Building', 'Non-human MC'],
    status: 'Ongoing',
    views: 850,
    featured: true,
    seo_title: 'Reincarnated as a Mythical Dungeon Core - LitRPG Novel',
    seo_description: 'Build, survive, and conquer. Read Reincarnated as a Mythical Dungeon Core, a base-building LitRPG fantasy novel.',
    created_at: new Date('2026-06-18').toISOString(),
    updated_at: new Date('2026-06-26').toISOString(),
    published_at: new Date('2026-06-18').toISOString()
  },
  {
    id: 'novel-3',
    title: 'The Alchemist of Silverwood',
    slug: 'the-alchemist-of-silverwood',
    author: 'Maeve_Green',
    cover_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
    synopsis: 'Elara wanted a quiet life in the countryside brewing herbal tea and curing local pets. But when a dying legendary knight leaves her a recipe for the "Elixir of Stars," she is forced to open an alchemy cottage in the middle of a sentient forest. A heartwarming cozy fantasy filled with strange plants, cheeky spirits, and lots of tea baking.',
    genre: ['Slice of Life', 'Comedy', 'Magic', 'Drama'],
    tags: ['Cozy Fantasy', 'Female Protagonist', 'Crafting', 'Wholesome'],
    status: 'Completed',
    views: 1950,
    featured: false,
    seo_title: 'The Alchemist of Silverwood - Wholesome Cozy Fantasy',
    seo_description: 'Read the completed cozy fantasy story of Elara brewing strange herbs, befriending woodland spirits, and baking magical teas.',
    created_at: new Date('2026-05-10').toISOString(),
    updated_at: new Date('2026-06-20').toISOString(),
    published_at: new Date('2026-05-10').toISOString()
  },
  {
    id: 'novel-4',
    title: 'Chrono Trigger: The Eternal Saga',
    slug: 'chrono-trigger-the-eternal-saga',
    author: 'Zeno_Bytes',
    cover_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    synopsis: 'In the year 3042, humanity has harnessed time-drift vectors to escape a dying solar system. Marcus, a temporal mechanic on a colony vessel, accidentally triggers a dormant hyper-drive engine that flings him into a futuristic cyberpunk timeline that was supposed to have been erased. To fix his timeline, he must traverse five distinct eras of human history.',
    genre: ['Sci-Fi', 'Action', 'Adventure', 'Psychological'],
    tags: ['Time Travel', 'Cyberpunk', 'Mecha', 'Tragedy'],
    status: 'Completed',
    views: 2310,
    featured: false,
    seo_title: 'Chrono Trigger: The Eternal Saga - Sci-Fi Web Novel',
    seo_description: 'Travel through parallel eras and post-apocalyptic futures. A masterpiece of time-travel cyberpunk sci-fi.',
    created_at: new Date('2026-04-01').toISOString(),
    updated_at: new Date('2026-06-15').toISOString(),
    published_at: new Date('2026-04-01').toISOString()
  }
];

const SEED_CHAPTERS: Chapter[] = [
  // Chapters for Shadow Librarian
  {
    id: 'ch-1-1',
    novel_id: 'novel-1',
    chapter_number: 1,
    title: 'The Scent of Ancient Ink',
    slug: 'chapter-1-the-scent-of-ancient-ink',
    content: `
      <p>The Whispering Vaults had no candles. Light was a luxury in the sky-city of Aethelgard, reserved for the upper spires where the High Nobles bathed in the perpetual glow of the solar mirrors. Down here, in the cold bedrock archives, scribes like Arthur navigated by the cold, faint luminescence of raw blue essence crystals.</p>
      <p>"Careful with that crate, boy," Master Olan rasped, his eyes milky white from fifty years of squinting at microscopic glyphs. "Those are memory spheres from the Third Dynasty. Crack one, and you will live your remaining days inside someone else's nightmares."</p>
      <p>Arthur nodded, wiping sweat from his forehead. He carried a heavy pine crate bound in copper bands. Inside lay twelve spheres of solidified crystal, each containing the memories of dead lords, master builders, and disgraced sorcerers. To the untrained eye, they were mere glass baubles. To the Royal Library, they were the foundation of their power.</p>
      <p>As Arthur placed the crate on a damp limestone table, his finger brushed against a peculiar sphere nestled in the corner. Unlike the pale blue memory cores, this one was pitch black, consuming the faint light around it. The surface was cold—colder than the mountain wind.</p>
      <p>A sudden, sharp tingle shot up Arthur's arm. In his mind, a voice spoke. It was not a sound, but a direct impression of letters burning into his consciousness:</p>
      <p><em>"The shadow remembers what the light burns away."</em></p>
      <p>Arthur gasped, jerking his hand back. His heart hammered in his ribs. He looked at Master Olan, but the old archivist was already shuffling down another dark corridor, his cane tapping rhythmically against the stone tiles.</p>
      <p>Arthur looked back at the black sphere. It remained there, silent, dark, and utterly forbidden. He knew he should report it. Rogue cores were supposed to be locked in the Iron Sarcophagi immediately. But as he stared into the dark crystal, he saw a tiny spark of silver flickering deep within its core, calling to him.</p>
    `,
    status: 'Published',
    views: 520,
    created_at: new Date('2026-06-15').toISOString(),
    updated_at: new Date('2026-06-15').toISOString(),
    published_at: new Date('2026-06-15').toISOString()
  },
  {
    id: 'ch-1-2',
    novel_id: 'novel-1',
    chapter_number: 2,
    title: 'An Obsidian Whisper',
    slug: 'chapter-2-an-obsidian-whisper',
    content: `
      <p>That night, Arthur could not sleep. His small cot in the communal scribe dormitories felt like a cage. Every time he closed his eyes, he saw that black sphere, spinning in the dark vaults beneath the city.</p>
      <p>The rules of Aethelgard were absolute. Any scribe caught stealing or hiding a memory sphere faced immediate memory extraction—a process that left a person a hollow, mindless husk, serving out their remaining days as a silent janitor in the lower docks.</p>
      <p>And yet, when the clock struck midnight, Arthur found himself dressing in his dark grey robes. He slipped his copper master-key into his sleeve, a keepsake his late father had left him.</p>
      <p>The corridors of the High Archives were empty. The air was thick with the scent of ancient parchment, dried lavender, and the faint, metallic smell of leaking raw essence. He bypassed the guard post easily—the guards were always drunk on cheap spice-wine by the second watch.</p>
      <p>When he reached the Forbidden Vault, his hands shook. He inserted the copper key. With a heavy, grinding sound, the thick iron door swung open. He slipped inside and closed it behind him, plunging into complete darkness.</p>
      <p>He didn't need a crystal light. He could feel the cold hum of the obsidian sphere. It pulled at his senses, like a gravitational well in the dark.</p>
      <p>He walked forward, hands outstretched, until his fingers brushed the cold polished stone of the table. His hand closed around the black crystal. Instantly, the ground beneath his feet seemed to dissolve.</p>
      <p>He fell—not down, but sideways, slipping through the shadows of the room. The stone vaults disappeared, replaced by a wide, obsidian plain under a sky filled with weeping silver stars.</p>
    `,
    status: 'Published',
    views: 410,
    created_at: new Date('2026-06-20').toISOString(),
    updated_at: new Date('2026-06-20').toISOString(),
    published_at: new Date('2026-06-20').toISOString()
  },
  {
    id: 'ch-1-3',
    novel_id: 'novel-1',
    chapter_number: 3,
    title: 'The Shadow Walk',
    slug: 'chapter-3-the-shadow-walk',
    content: `
      <p>Arthur stood on the silent, black plain. He looked down at his hands, but they were made of flickering silver mist. He was no longer physical; he was an imprint, a shadow navigating the memory of a time before the archives were built.</p>
      <p>Before him stood a massive structure. It was not Aethelgard, but a grand palace carved from solid basalt, towering into the starry void. Giant banners of purple silk hung from the balconies, though there was no wind to move them.</p>
      <p>"You shouldn't be here, little scribe," a voice echoed.</p>
      <p>Arthur turned. Walking toward him was a figure wrapped in silver-threaded armor, their face hidden behind a mask resembling a roaring dragon. Yet, the figure's body flickered and distorted, like an unstable projection.</p>
      <p>"Is this... a memory?" Arthur whispered, his voice echoing strangely.</p>
      <p>"It is a record of the truth," the armored figure said. "The High Inquisitors tell you that magic was a gift from the solar mirrors, that it was harvested to lift the city. They lie. Magic was stolen from the deep dark beneath the earth. And the sky-city is not climbing—it is running away from what lies below."</p>
      <p>The figure stepped closer, extending a metallic gauntlet. "The black core you hold is my memory. I was the First Librarian, buried and forgotten because I refused to rewrite the ledger of the sky. Will you carry my ledger, Arthur?"</p>
      <p>Arthur stared at the silver gauntlet. He knew that taking it meant declaring war on the entire establishment. It meant living as a heretic, a rogue. But as he looked back at his mundane, colorless life in the dark library, he knew he had already crossed the line.</p>
      <p>"I will carry it," Arthur said, and reached out to grasp the silver hand.</p>
    `,
    status: 'Published',
    views: 310,
    created_at: new Date('2026-06-27').toISOString(),
    updated_at: new Date('2026-06-27').toISOString(),
    published_at: new Date('2026-06-27').toISOString()
  },
  // Chapters for Dungeon Core
  {
    id: 'ch-2-1',
    novel_id: 'novel-2',
    chapter_number: 1,
    title: 'The Sapphire Awakening',
    slug: 'chapter-1-the-sapphire-awakening',
    content: `
      <p>Waking up was a strange sensation. There was no yawning, no blinking, and no heavy limbs. In fact, there were no limbs at all.</p>
      <p>Instead, my vision was a complete 360-degree sphere of sight. I could see the ceiling of a damp, mossy cavern, the dripping stalactites, the muddy puddle on the floor, and... myself.</p>
      <p>In the center of the cavern, embedded in a block of sparkling white quartz, was a large, beautifully cut sapphire. It was about the size of a soccer ball, radiating a soft, rhythmic blue light.</p>
      <p><em>That crystal... is me.</em></p>
      <p>Suddenly, a bright blue translucent screen materialized in my mind.</p>
      <p><strong>[SYSTEM BOOTING... SUCCESSFUL]</strong><br/>
      <strong>[ENTITY CLASS]:</strong> Mythical Dungeon Core (Sapphire Core)<br/>
      <strong>[LEVEL]:</strong> 1 (0/100 Essence)<br/>
      <strong>[DUNGEON MANA]:</strong> 50/50<br/>
      <strong>[DOMAIN EXPANSION]:</strong> Cavern Room 1 (Radius: 10 meters)<br/>
      <strong>[AVAILABLE UNLOCKED SPACES]:</strong> None</p>
      <p>"A dungeon core?" I thought. "Like in those LitRPG web novels I used to read in my college dorm?"</p>
      <p><strong>[NOTIFICATION: Core consciousness detected. Affirmative. You have been selected as the central core of Dungeon #402, classified under high-threat potential.]</strong></p>
      <p>I felt a sudden rush of cold panic, or whatever the crystal equivalent of panic was. "High threat? Why? Where am I?"</p>
      <p>Before the system could answer, a loud, heavy footsteps echoed from the cavern entrance. Two creatures stepped into my field of vision. They were short, hunched, with green leathery skin, long pointed noses, and carrying rusted iron daggers.</p>
      <p><em>Goblins.</em> And they looked extremely hungry.</p>
    `,
    status: 'Published',
    views: 450,
    created_at: new Date('2026-06-18').toISOString(),
    updated_at: new Date('2026-06-18').toISOString(),
    published_at: new Date('2026-06-18').toISOString()
  },
  {
    id: 'ch-2-2',
    novel_id: 'novel-2',
    chapter_number: 2,
    title: 'Designing the First Trap',
    slug: 'chapter-2-designing-the-first-trap',
    content: `
      <p>The two goblins sniffed the damp air, their yellow eyes immediately locking onto the glowing blue sapphire in the center of the cave. They chattered excitedly in their guttural language, saliva dripping from their mouths.</p>
      <p>"They want to eat me," I realized. If they shattered my sapphire core, it would be game over.</p>
      <p>I focused on my system screen. "System! How do I defend myself? Is there a shop? Spells?"</p>
      <p><strong>[ALERT: Intruders detected within Domain. Accessing Dungeon Design Menu...]</strong><br/>
      <strong>[Spikes Trap]:</strong> Cost: 15 Mana. Causes physical pierce damage.<br/>
      <strong>[Summon Slime (Common)]:</strong> Cost: 20 Mana. Summons an acidic fluid entity.<br/>
      <strong>[Damp Air Trap]:</strong> Cost: 10 Mana. Condenses moisture to make surfaces slippery.</p>
      <p>I had 50 Mana. The goblins were moving closer, their muddy claws reaching out.</p>
      <p>"Place Damp Air Trap on the smooth stone slope right before my quartz altar!" I willed. "And summon one Acid Slime on top of it!"</p>
      <p><strong>[-30 Mana. Remaining: 20]</strong></p>
      <p>Instantly, a heavy dew formed on the rocky incline, turning it into a slick, mirror-like ice rink. The lead goblin, rushing eagerly toward the sparkling blue gem, stepped on the wet patch. His legs flew out from under him, and he slid forward with a high-pitched shriek.</p>
      <p>Right into the waiting green-translucent jelly that had just materialized. The Acid Slime hissed, wrapping its gelatinous, bubbling body around the goblin's head. The cavern filled with the sound of sizzling leather and frantic muffled screams.</p>
    `,
    status: 'Published',
    views: 400,
    created_at: new Date('2026-06-26').toISOString(),
    updated_at: new Date('2026-06-26').toISOString(),
    published_at: new Date('2026-06-26').toISOString()
  }
];

// Memory cache for serverless environments (like Vercel)
let memoryCache: { novels: Novel[], chapters: Chapter[] } | null = null;

// Read from JSON file
export function getDbData(): { novels: Novel[], chapters: Chapter[] } {
  if (memoryCache) {
    return memoryCache;
  }

  ensureDirectories();

  // Try to read from file first
  try {
    if (fs.existsSync(DB_FILE)) {
      const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
      memoryCache = JSON.parse(fileContent);
      return memoryCache!;
    }
  } catch (error) {
    console.warn("Error reading database file from disk:", error);
  }

  // Use seeds and try to write them (it's okay if write fails)
  const initialData = { novels: SEED_NOVELS, chapters: SEED_CHAPTERS };
  memoryCache = initialData;

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  } catch (writeError) {
    console.warn("Could not write initial seeds to disk (this is expected on serverless like Vercel):", writeError);
  }

  return initialData;
}

// Write to JSON file
export function saveDbData(data: { novels: Novel[], chapters: Chapter[] }) {
  memoryCache = data;
  ensureDirectories();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.warn("Could not save data to disk (this is expected on serverless like Vercel, changes kept in memory):", error);
  }
}

export const dbService = {
  // --- NOVELS CRUD ---
  async getNovels(): Promise<Novel[]> {
    if (useSupabase && supabase) {
      try {
        const { data, error } = await supabase
          .from('novels')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
      } catch (err) {
        // Fallback to local storage silently
      }
    }
    const { novels } = getDbData();
    return [...novels].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async getNovelBySlug(slug: string): Promise<Novel | null> {
    if (useSupabase && supabase) {
      try {
        const { data, error } = await supabase
          .from('novels')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();
        if (error) throw error;
        return data;
      } catch (err) {
        // Fallback to local storage silently
      }
    }
    const { novels } = getDbData();
    return novels.find(n => n.slug === slug) || null;
  },

  async createNovel(novelData: Omit<Novel, 'id' | 'views' | 'created_at' | 'updated_at'>): Promise<Novel> {
    const newNovel: Novel = {
      ...novelData,
      id: 'novel-' + Math.random().toString(36).substr(2, 9),
      views: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (useSupabase && supabase) {
      try {
        const { data, error } = await supabase
          .from('novels')
          .insert([{
            title: newNovel.title,
            slug: newNovel.slug,
            author: newNovel.author,
            cover_url: newNovel.cover_url,
            synopsis: newNovel.synopsis,
            genre: newNovel.genre,
            tags: newNovel.tags,
            status: newNovel.status,
            featured: newNovel.featured,
            seo_title: newNovel.seo_title,
            seo_description: newNovel.seo_description
          }])
          .select()
          .single();
        if (error) throw error;
        return data;
      } catch (err) {
        // Fallback to local storage silently
      }
    }
    const data = getDbData();
    data.novels.push(newNovel);
    saveDbData(data);
    return newNovel;
  },

  async updateNovel(id: string, updatedFields: Partial<Novel>): Promise<Novel> {
    if (useSupabase && supabase) {
      try {
        const { data, error } = await supabase
          .from('novels')
          .update({
            ...updatedFields,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } catch (err) {
        // Fallback to local storage silently
      }
    }
    const data = getDbData();
    const index = data.novels.findIndex(n => n.id === id);
    if (index === -1) throw new Error('Novel not found');
    
    data.novels[index] = {
      ...data.novels[index],
      ...updatedFields,
      updated_at: new Date().toISOString()
    };
    saveDbData(data);
    return data.novels[index];
  },

  async deleteNovel(id: string): Promise<boolean> {
    if (useSupabase && supabase) {
      try {
        const { error } = await supabase
          .from('novels')
          .delete()
          .eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        // Fallback to local storage silently
      }
    }
    const data = getDbData();
    data.novels = data.novels.filter(n => n.id !== id);
    // Cascade delete chapters
    data.chapters = data.chapters.filter(c => c.novel_id !== id);
    saveDbData(data);
    return true;
  },

  async incrementNovelViews(id: string): Promise<void> {
    if (useSupabase && supabase) {
      try {
        const { error } = await supabase.rpc('increment_novel_views', { novel_id: id });
        if (error) throw error;
        return;
      } catch (err) {
        // Fallback to manual increment if trigger/rpc not installed yet
        try {
          const { data } = await supabase.from('novels').select('views').eq('id', id).single();
          if (data) {
            await supabase.from('novels').update({ views: (data.views || 0) + 1 }).eq('id', id);
            return;
          }
        } catch (innerErr) {
          // Fallback silently
        }
      }
    }
    const data = getDbData();
    const novel = data.novels.find(n => n.id === id);
    if (novel) {
      novel.views += 1;
      saveDbData(data);
    }
  },

  // --- CHAPTERS CRUD ---
  async getChapters(novelId?: string): Promise<Chapter[]> {
    if (useSupabase && supabase) {
      try {
        let query = supabase.from('chapters').select('*');
        if (novelId) {
          query = query.eq('novel_id', novelId);
        }
        const { data, error } = await query.order('chapter_number', { ascending: true });
        if (error) throw error;
        return data || [];
      } catch (err) {
        // Fallback to local storage silently
      }
    }
    const { chapters } = getDbData();
    let filtered = chapters;
    if (novelId) {
      filtered = chapters.filter(c => c.novel_id === novelId);
    }
    return [...filtered].sort((a, b) => a.chapter_number - b.chapter_number);
  },

  async getChapterBySlug(novelId: string, chapterSlug: string): Promise<Chapter | null> {
    if (useSupabase && supabase) {
      try {
        const { data, error } = await supabase
          .from('chapters')
          .select('*')
          .eq('novel_id', novelId)
          .eq('slug', chapterSlug)
          .maybeSingle();
        if (error) throw error;
        return data;
      } catch (err) {
        // Fallback to local storage silently
      }
    }
    const { chapters } = getDbData();
    return chapters.find(c => c.novel_id === novelId && c.slug === chapterSlug) || null;
  },

  async createChapter(chapterData: Omit<Chapter, 'id' | 'views' | 'created_at' | 'updated_at'>): Promise<Chapter> {
    const newChapter: Chapter = {
      ...chapterData,
      id: 'ch-' + Math.random().toString(36).substr(2, 9),
      views: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (useSupabase && supabase) {
      try {
        const { data, error } = await supabase
          .from('chapters')
          .insert([{
            novel_id: newChapter.novel_id,
            chapter_number: newChapter.chapter_number,
            title: newChapter.title,
            slug: newChapter.slug,
            content: newChapter.content,
            status: newChapter.status
          }])
          .select()
          .single();
        if (error) throw error;
        return data;
      } catch (err) {
        // Fallback to local storage silently
      }
    }
    const data = getDbData();
    data.chapters.push(newChapter);
    saveDbData(data);
    return newChapter;
  },

  async updateChapter(id: string, updatedFields: Partial<Chapter>): Promise<Chapter> {
    if (useSupabase && supabase) {
      try {
        const { data, error } = await supabase
          .from('chapters')
          .update({
            ...updatedFields,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } catch (err) {
        // Fallback to local storage silently
      }
    }
    const data = getDbData();
    const index = data.chapters.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Chapter not found');
    
    data.chapters[index] = {
      ...data.chapters[index],
      ...updatedFields,
      updated_at: new Date().toISOString()
    };
    saveDbData(data);
    return data.chapters[index];
  },

  async deleteChapter(id: string): Promise<boolean> {
    if (useSupabase && supabase) {
      try {
        const { error } = await supabase
          .from('chapters')
          .delete()
          .eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        // Fallback to local storage silently
      }
    }
    const data = getDbData();
    data.chapters = data.chapters.filter(c => c.id !== id);
    saveDbData(data);
    return true;
  },

  async incrementChapterViews(id: string): Promise<void> {
    if (useSupabase && supabase) {
      try {
        const { error } = await supabase.rpc('increment_chapter_views', { chapter_id: id });
        if (error) throw error;
        return;
      } catch (err) {
        try {
          const { data } = await supabase.from('chapters').select('views').eq('id', id).single();
          if (data) {
            await supabase.from('chapters').update({ views: (data.views || 0) + 1 }).eq('id', id);
            return;
          }
        } catch (innerErr) {
          // Fallback silently
        }
      }
    }
    const data = getDbData();
    const chapter = data.chapters.find(c => c.id === id);
    if (chapter) {
      chapter.views += 1;
      saveDbData(data);
    }
  },

  // --- STATS ---
  async getStats(): Promise<Stats> {
    const novels = await this.getNovels();
    const chapters = await this.getChapters();
    
    const totalViews = novels.reduce((acc, curr) => acc + (curr.views || 0), 0) +
                       chapters.reduce((acc, curr) => acc + (curr.views || 0), 0);

    return {
      totalNovels: novels.length,
      totalChapters: chapters.length,
      totalViews,
      latestNovels: novels.slice(0, 5)
    };
  },

  // --- FILE UPLOADS ---
  async handleCoverUpload(fileName: string, base64Data: string): Promise<string> {
    // base64Data looks like: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 image data');
    }
    const buffer = Buffer.from(matches[2], 'base64');
    
    // Create random unique filename
    const ext = path.extname(fileName) || '.jpg';
    const uniqueName = `cover-${Date.now()}-${Math.random().toString(36).substr(2, 5)}${ext}`;

    if (useSupabase && supabase) {
      try {
        // Upload directly to Supabase storage 'covers' bucket
        const { error } = await supabase.storage
          .from('covers')
          .upload(uniqueName, buffer, {
            contentType: matches[1],
            cacheControl: '3600',
            upsert: false
          });
        if (error) throw error;

        const { data } = supabase.storage.from('covers').getPublicUrl(uniqueName);
        return data.publicUrl;
      } catch (err) {
        console.warn("Supabase cover upload failed, falling back to local file upload:", err);
      }
    }
    
    // Write locally to public assets or uploads directory
    ensureDirectories();
    const localPath = path.resolve(UPLOADS_DIR, uniqueName);
    try {
      fs.writeFileSync(localPath, buffer);
      return `/uploads/${uniqueName}`;
    } catch (writeErr) {
      console.warn("Could not write uploaded file to disk (expected on read-only environments), falling back to Base64:", writeErr);
      const mimeType = matches[1];
      const base64Str = matches[2]; // matches[2] is the actual base64 content
      return `data:${mimeType};base64,${base64Str}`;
    }
  }
};

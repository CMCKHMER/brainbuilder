// ============================================================
// CAMPAIGN DATA — Realm Of The Khmer Empire
// Cambodian Folklore Epic: Ancestral Spirits, Naga Serpents, Sacred Flames
// ============================================================

export interface CampaignChapter {
  id: string;
  chapterNumber: number;
  title: string;
  subtitle: string;
  introNarration: string;
  victoryNarration: string;
  defeatNarration: string;
  objectives: string[];
  battleSetup?: {
    territoryAssignments?: Record<string, { ownerId: string; units: string[] }>;
    bonusReinforcements?: number;
  };
}

// ============================================================
// WORLD LORE
// ============================================================

export const WORLD_LORE = {
  title: "The War of the Broken Crown",
  history: `Before the Shattering, the Khmer Empire was the jewel of Southeast Asia — a vast and radiant civilization that stretched from the Mekong delta to the mist-shrouded peaks of Phnom Kulen. At its heart stood Angkor Wat, the largest religious monument ever built by human hands, its five lotus-bud towers rising above a city of a million souls. The empire's power did not come from armies alone, though its war elephants and temple guardians were legendary. It came from the Sacred Crown — a circlet forged in the fire temples of Phnom Kulen from a single, flawless piece of jade blessed by the naga serpent kings themselves. For nine centuries, the Sacred Crown kept peace among the empire's peoples and bound the spirit world to the mortal one in a delicate, sacred harmony.

The empire endured for nine centuries under the guidance of the Temple Guardians, an ancient order of warrior-monks who safeguarded the sacred sites and mediated between the human realm and the spirit world. Each king who wore the Crown was blessed with wisdom and long life, and the land prospered. Rice paddies stretched to every horizon, fed by an ingenious network of canals and reservoirs.

The great barays — vast artificial lakes that served as both irrigation systems and sacred reflections of the cosmic Ocean of Milk — held water enough to see the empire through even the cruelest drought. Angkor Wat's stone walls told the story of the cosmos in exquisite bas-relief — the churning of the Ocean of Milk, the triumphs of the devas over the asuras, the eternal dance of creation and destruction that underpins all existence. Pilgrims traveled from distant lands to walk the temple causeways and pray before the jade altars, and the naga serpent kings were said to slumber peacefully in the deep pools of the Mekong, content with the harmony their gift had made possible.

The empire's armies were equally legendary, though war was rare during the centuries of Crown-blessed peace. When conflict came — from rival kingdoms to the west, from sea raiders along the coast, or from spirit incursions when the barrier between worlds grew thin — the Temple Guardians rode forth on jade-armored war elephants at the head of peasant levies who fought with ferocious loyalty. The Royal Guard of Angkor Wat, ancestors of the Soryan dynasty, were considered the finest warriors in the known world, their discipline unmatched and their jade-forged weapons unequaled. But it was not military might that made the Khmer Empire great. It was faith — faith in the jade, faith in the ancestors, and faith in the sacred compact that bound the living and the dead in an unending cycle of mutual protection and reverence.

But the last king, Jayavarman the Unbroken, grew fearful of death in his old age. He had ruled wisely for sixty years, but the prospect of leaving his beloved empire to an uncertain successor consumed him. He came to believe that the Sacred Crown could grant him more than long life — it could grant him eternity itself. In secret, far from the eyes of the Temple Guardians, he descended into the deepest fire temple of Phnom Kulen and performed a forbidden ritual, one that the naga kings had warned the first Khmer kings never to attempt: the severing of the soul from the mortal body and its binding to the jade of the Crown. He sought to become one with the stone, to rule his empire not for a lifetime but forever.

The ritual demanded a price no mortal should pay: the severing of the ancient bond between the human and spirit realms. When the naga kings felt the compact shatter, they shrieked in fury, and their wrath shook the earth. Rivers boiled. The sky turned the color of bruised jade.

The Sacred Crown, unable to contain the power Jayavarman forced into it, cracked into four fragments, each blazing with corrupted jade fire. The shockwave tore through Angkor Wat, splitting its towers and draining the great barays dry in a single night. The spirit world, no longer bound by the Crown's harmony, bled into the mortal one. Ancestral spirits became vengeful wraiths. Temple Guardians caught in the blast were twisted into hollow echoes of their former selves. The land itself fractured — rivers changed course, forests grew wild with spirit energy, and the mist from the Mekong swallowed whole provinces.

King Jayavarman the Unbroken was transformed. His body became a vessel of void energy, a hollow king wearing a broken crown, his humanity consumed by the very jade he had sought to master. He retreated into the caverns beneath Phnom Kulen, attended by the corrupted Temple Guardians who had been caught in the ritual's blast.

From the ruins of the empire, four warlords rose — each claiming a fragment of the Sacred Crown and a vision for what the Khmer lands should become. Soryan the Iron Strategist, Chanreth the Stormcaller, Veasna of Shadows, and Kiriath the Eternal Flame. They warred against each other for dominance, even as the Hollow King's influence crept through the land like poison through a river.

The years that followed were a nightmare of fire and spirit. Villages burned as vengeful wraiths hunted those who had once worshipped at the jade altars. The great roads connecting Angkor Wat to the provinces became impassable, choked with spirit-mist and haunted by the echoes of the dead. Refugees flooded the remaining habitable lands, and the warlords who would eventually divide the empire between them first emerged as protectors of these desperate communities, their authority born not from royal blood but from the sword and the spear.

This was the Shattering — the beginning of what would be known as the War of the Broken Crown.`,

  sacredJadeLore: `Sacred jade is the crystalline lifeblood of the Khmer Empire, a stone that exists at the boundary between the mortal world and the spirit realm. In its pure form, it glows with a soft green luminescence and hums with the whisper of ancestral spirits. The naga serpent kings bestowed it upon the first Khmer kings as a gift of covenant — a promise that the two realms would coexist in harmony for as long as the jade endured. Every temple in the empire held at least one jade altar, and every royal decree was sealed with a jade stamp that was believed to carry the weight of the ancestors' approval. The jade appeared in three known varieties: River Jade, found in the Mekong's depths, which glowed blue-green and was prized for healing; Mountain Jade, mined from Phnom Kulen's slopes, which burned gold and was used in forging weapons; and Deep Jade, gifted only by the naga from the spirit realm's own deposits, which shimmered between all colors and was required for the Sacred Crown itself.

The empire developed two primary disciplines of jade craft over the centuries. The first was Temple Forging — the art of infusing jade into weapons and armor through sacred rituals conducted at the fire temples of Phnom Kulen. Smiths would meditate for days before approaching the forge, allowing the spirits of their ancestors to guide their hands. Jade-forged blades could cut through iron as though it were silk, and jade-woven armor turned aside arrows and spears with the blessing of the ancestor spirits. Each temple maintained its own forging traditions, and the greatest weapons were said to contain the spirit of the smith's lineage, awakening only in the hands of a worthy heir. The war elephants of the Royal Guard wore jade-reinforced howdahs that could deflect spirit fire, and the temple walls themselves were embedded with jade crystals that created protective barriers against malevolent spirits.

The second discipline was Spirit Channeling — the dangerous practice of opening one's mind to the spirits bound within the jade. Skilled channelers could commune with ancestors, glimpse possible futures, and even command lesser spirits to do their bidding in the mortal world. The storm monks of the eastern highlands used Spirit Channeling to call down monsoon lightning through jade resonators, while the deep-pool priestesses of the Mekong channeled the naga themselves, learning secrets of healing and prophecy. But Spirit Channeling exacted a terrible toll. Each use eroded the channeler's connection to the living world, drawing them deeper into the spirit realm. Those who channeled too deeply became hollow — empty vessels animated by spirit energy, serving unknowable purposes with blank eyes and silent steps.

After the Shattering, the four warlords each developed their own relationship with the sacred jade. King Soryan of Soryanthar treats it as a military resource, embedding jade shards into the weapons and armor of his war elephants and temple soldiers, viewing it through the lens of strategy and warfare. Lord Chanreth of the Stormrealm channels jade through the monsoon storms themselves, using wind and lightning as conduits for spirit energy, believing the storms are the ancestors' way of speaking to the living. Queen Veasna of the Shadowlands communes with the naga through corrupted jade, learning shadow arts that allow her warriors to step between the mortal world and the spirit realm, embracing the blurring of boundaries that the other factions fear. Emperor Kiriath of the Fire Temples feeds jade directly into his sacred flames, believing that only the eternal fire can purify the corrupted stone and restore the Sacred Crown to its original purpose.

Of all the jade's mysteries, the most terrifying is its memory. Sacred jade does not forget what it has witnessed. The jade that now pulses beneath the Hollow King's throne remembers the naga kings' blessing, the forging of the Crown, the nine centuries of peace, and the moment Jayavarman's ritual shattered everything. Some scholars believe that if the jade could be made to speak its memories, it could reveal the exact nature of the forbidden ritual and perhaps even the way to undo it. But no one has yet devised a method for listening to jade without falling prey to Spirit Channeling's terrible toll.`,

  theHollowKing: `King Jayavarman the Unbroken was once the most beloved ruler the Khmer Empire had known — a poet-king who inscribed his own verses on the walls of Angkor Wat and who walked among his people without guards or ceremony. He composed love poems to the Mekong and battle hymns for his war elephants. His love for his empire was genuine, deep, and all-consuming, and it was that very love — twisted by the fear of losing what he cherished — that became the seed of his destruction.

When the forbidden ritual consumed his humanity, what remained was not a man, not even a spirit, but something far worse: a void wearing a king's crown. The Hollow King does not speak with his own voice. Instead, the shattered spirits trapped within the corrupted jade speak through him — a chorus of broken whispers that emanate from his twisted form like the drone of a thousand dying insects. Those who have glimpsed him describe a figure draped in tattered royal silks, his face an ever-shifting mask of shadows and jade light, the four fragments of the Sacred Crown orbiting his head in slow, predatory circles.

His servants are the corrupted Temple Guardians — once the empire's most sacred warriors, now hollow shells encased in ceremonial armor that has fused with their flesh. They move in perfect, silent unison, their movements eerily graceful, as if performing a temple dance that has no music and no audience. They wield jade-cursed weapons that burn with a sickly green fire, flames that consume not flesh but spirit, leaving the body intact while erasing everything that made it human. They do not eat, sleep, or rest. They simply serve the Hollow King's will, which pulses outward from Phnom Kulen like the heartbeat of something vast and terrible. Entire villages have been found emptied, their populations led away in silent processions toward the mountain, their eyes glazed with jade-green light.

In the three generations since the Shattering, there have been sighting after sighting. Merchants traveling the old Khmer roads report passing through villages where every inhabitant stands motionless in the town square, eyes closed, lips moving in unison, chanting in a language that predates the empire itself. Children born near Phnom Kulen are sometimes found with jade-colored eyes that glow faintly in the dark and a knowledge of things no child should know. And hunters who venture too close to the mountain return with their jade amulets dark and cracked, the ancestor spirits that once dwelt within them simply gone — drawn, perhaps, into the void that calls itself a king.

But the most insidious aspect of the Hollow King's power is not his servants or his corrupted armies. It is the jade itself. Every shard of sacred jade across the empire carries a fragment of his shattered consciousness, and through those shards, his whispers reach every corner of the land. In the quiet hours before dawn, farmers hear his voice in the jade amulets hanging above their doorways. Soldiers feel his presence in the jade inlays of their weapons. Even the warlords themselves are not immune — each one has caught, in moments of exhaustion or doubt, the whisper of a voice that is not their own, promising power, promising peace, promising the beautiful simplicity of surrender. The jade remembers its king, and it wants to serve him again.

And now, after three generations of slow, patient growth, the Hollow King is ready. The tremors beneath Phnom Kulen have become constant. The spirit-mist along the Mekong thickens with each passing week. The four warlords, so busy fighting each other, have failed to notice the ground beneath their feet turning cold. The Hollow King's awakening is not a possibility — it is an inevitability. The only question that remains is whether anyone will be strong enough, wise enough, and desperate enough to stop him when he finally opens his eyes.`,
};

// ============================================================
// FACTION BACKSTORIES
// ============================================================

export const FACTION_STORIES: Record<string, {
  name: string;
  leader: string;
  motto: string;
  backstory: string;
  motivation: string;
  secret: string;
}> = {
  knight: {
    name: "Kingdom of Soryanthar",
    leader: "King Soryan the Iron Strategist",
    motto: "Victory is carved in stone; defeat is written in water.",
    backstory: `The Kingdom of Soryanthar traces its lineage directly to the Royal Guard of Angkor Wat — an elite military order that protected the Sacred Crown and the temple city for nine centuries. When the Shattering tore the empire apart, it was General Soryan's grandfather, Commander Bophan the Gatekeeper, who held the eastern gates of Angkor Wat open long enough for ten thousand refugees to escape the collapsing temple complex. He paid for it with his life, crushed beneath a falling apsara carving, his jade blade still drawn and glowing in the darkness.

Three generations later, the Soryan family still carries the weight of that sacrifice. King Soryan commands the most disciplined military force in the shattered empire, renowned for their ironclad formations and their mastery of jade-embedded war machinery. His war elephants are fitted with jade-reinforced howdahs that can withstand direct hits from spirit-fire, and his infantry fights in interlocking shield walls that have not broken in living memory. Soryan himself wields the Gatekeeper's Blade — his grandfather's jade sword, still humming with the old guardian's spirit, a blade that has tasted the blood of corrupted Temple Guardians and emerged burning brighter for it.

But the kingdom's strength is also its curse. The old Royal Guard oath demands absolute loyalty to the Crown — but the Crown is broken, and its wearer has become a monster. Some within Soryanthar whisper that the Soryan family's true duty is to the Hollow King himself, that Commander Bophan's dying act was not to save the people but to preserve the dynasty's sacred connection to the throne. King Soryan violently rejects these rumors, but they persist like monsoon mist — impossible to dispel, seeping into every crack in the kingdom's unity.

The kingdom's capital is a fortress-city called Gatehold, built from the stones of Angkor Wat's fallen eastern gatehouse. Its walls are embedded with jade crystals that create a constant low hum, a remnant of the temple's protective barriers. Within Gatehold, every soldier trains daily in the old Royal Guard formations, and the war elephants are stabled in courtyards where jade-inlaid floor tiles keep their temperaments calm and their strength enhanced. It is a city of discipline, duty, and barely contained fear — fear that the Hollow King's whispers will one day prove true, and that the Soryan dynasty's loyalty belongs to a monster wearing a broken crown.`,
    motivation: `King Soryan fights to restore order to the Khmer lands. He believes the realm needs a strong central authority to resist the Hollow King, and he is convinced that authority should be his by right of blood and sacrifice. He is not cruel, but he is rigid — he sees war as a necessary tool for unification, and he will not hesitate to crush those who stand in the way of what he believes is the greater good. He dreams of rebuilding Angkor Wat and forging the Sacred Crown anew from the four fragments, restoring the empire to its former glory under the Soryan dynasty.`,
    secret: `The Kingdom of Soryanthar possesses a fragment of the original Crown-forging ritual, recovered from the ruins of the Phnom Kulen fire temples by Soryan's grandfather. King Soryan has kept this secret even from his own generals, locked in a jade-sealed chest that only the Soryan bloodline can open. He does not intend to complete the forbidden ritual — but he believes its principles could be used to construct a device that could either amplify or suppress jade energy across the empire. If he can build it, he could either weaponize every jade deposit in the land or render the Hollow King powerless. He has not yet decided which path to take.`,
  },

  mage: {
    name: "Stormrealm of Chanreth",
    leader: "Lord Chanreth the Stormcaller",
    motto: "Where thunder walks, the earth remembers its place.",
    backstory: `The Stormrealm of Chanreth was born from the empire's storm temples — sacred sites built atop the highest peaks along the Mekong, where monks once mediated between the monsoon rains and the spirit world. When the Shattering destroyed Angkor Wat, the surviving storm monks fled to the eastern highlands, where they rebuilt their tradition among the lightning-scarred peaks and the endless, roiling clouds that never seem to part.

Lord Chanreth is the Stormrealm's most powerful leader in generations, born during the Great Monsoon of the Shattering itself — a storm so violent it was said to have been summoned by the naga kings in their fury at Jayavarman's arrogance. From birth, Chanreth could hear the spirits in the wind, and by adulthood he had mastered three of the storm temples' most guarded disciplines: the Lightning Speakers, who can call down bolts of jade-infused lightning with a gesture; the Wind Walkers, who can move across the battlefield faster than the eye can follow by riding the spirit winds; and the Monsoon Bringers, who can summon devastating rainstorms that flood enemy positions and turn the terrain itself into a weapon of the ancestors.

The Stormrealm's armies are unlike any other in the shattered empire. Where Soryanthar fields disciplined infantry, Chanreth deploys battlemages who fight from the sky, riding wind currents and striking with jade lightning that can shatter stone and turn war elephants to ash. Their war elephants are not armored for close combat but are instead fitted with jade resonators that amplify storm energy, turning each beast into a mobile lightning rod capable of electrifying entire battlefields. But the Stormrealm's reliance on Spirit Channeling has made them both powerful and feared — more than one monastery has been destroyed when a channeler lost control and the spirits they commanded turned on them, reducing sacred halls to smoking rubble.`,
    motivation: `Lord Chanreth is driven by a genuine desire to understand the spirit world and find a way to reseal the bond between the mortal and spirit realms. He believes the answer lies in the ancient storm temple records, many of which were lost in the Shattering but may yet survive in forgotten mountain monasteries. He views the other warlords as short-sighted warriors who fight over territory while the very fabric of reality unravels around them. His ultimate goal is not conquest but restoration — the healing of the wound that the Shattering tore between the two worlds. To this end, he has dispatched teams of scholar-monks into the most dangerous regions of the shattered empire, searching for lost temple records that might contain the ritual's reversal. Three such expeditions have been lost without a trace. A fourth returned with a single jade tablet inscribed with fragmentary instructions that Chanreth believes are the key — if he can decipher them before the Hollow King awakens fully.`,
    secret: `Deep within his meditation, Lord Chanreth has been visited by the naga kings themselves — not in physical form, but through the jade that courses through his blood and the storms that answer his call. The naga have shown him visions of the Hollow King's true power, revealing that the corrupted king is not merely a mortal transformed by a forbidden ritual but a gateway — a tear in the ancient barrier between worlds through which something vast and hungry from the deep spirit realm is trying to enter the mortal one. The naga have shown Chanreth that the Hollow King must not merely be defeated but properly sealed, or the breach will widen until both realms are consumed by the void. This knowledge terrifies him, for it means the war cannot be won by arms alone.`,
  },

  rogue: {
    name: "Veasna's Shadowlands",
    leader: "Queen Veasna of Shadows",
    motto: "The shadow knows what the light cannot bear to see.",
    backstory: `Veasna's Shadowlands is not a kingdom, not an army, and not a nation by any traditional definition. It is a web — a vast, sprawling network of spirit-walkers, mist-dancers, and temple outcasts that stretches across the mist-shrouded lowlands along the Mekong. The Shadowlands were born in the chaos of the Shattering, when the old empire's spirit-touched outcasts — those who had always lived on the margins of temple society, their gifts feared and their presence unwelcome — suddenly found themselves without masters to answer to and a world remade to their advantage.

Queen Veasna is the Shadowlands' undisputed ruler, though she rarely appears in public and never in the same form twice. She was once a temple acolyte in one of Angkor Wat's lesser shrines, a girl of fourteen who discovered during a rain-soaked meditation that she could step between the mortal world and the spirit realm at will — a gift that the Temple Guardians considered heresy and a corruption of the sacred order. Exiled long before the Shattering, she survived alone in the wild lands between provinces, learning the shadow arts from the naga queens who dwelt in the deep pools of the Mekong. When the Shattering shattered the barrier between worlds, Veasna's power multiplied a hundredfold. She can now move through shadows as easily as water, command spirit-beasts that lurk in the mist, and see through the eyes of any creature touched by jade.

The Shadowlands' military strength is unconventional but terrifying. They do not field armies in the open — they have no banners, no war drums, no formations that can be read by a scout on a distant hilltop. Instead, they deploy spirit-walkers who can pass through walls and assassinate targets before vanishing into mist, mist-dancers who use the monsoon fog as cover for devastating ambushes, and naga-bound spies who can take the form of serpents and infiltrate any stronghold. In open battle, the Shadowlands relies on hit-and-run strikes, psychological warfare, and the ability to appear and vanish like ghosts. Their opponents never know if the soldier beside them is truly alive or a spirit wearing a soldier's face. The other warlords despise the Shadowlands but cannot afford to ignore them. Every faction has hired Veasna's operatives for tasks too delicate for regular soldiers, creating a web of debts and secrets that gives Queen Veasna an outsized influence over the entire war.`,
    motivation: `Queen Veasna's true motivation is known only to the naga queens who counsel her from the deep pools. She claims to seek the reunification of the mortal and spirit realms — not the old harmony of the Sacred Crown, but a new synthesis in which the living and the dead coexist as equals, with the naga as mediators. Whether this vision is genuine liberation or an elegant mask for personal ambition, none can say with certainty. She plays a game measured in decades, and every maneuver on the war's chessboard serves a purpose that only she and the serpents beneath the water can perceive.`,
    secret: `The naga queens have revealed to Veasna the Hollow King's true nature — not a corrupted mortal king but a vessel for an ancient entity that the naga themselves imprisoned within the jade of the Sacred Crown millennia ago, long before the first Khmer king ever wore it. The forbidden ritual did not transform Jayavarman; it freed the entity and allowed it to consume him from within. The naga created the Sacred Crown as a prison, and Jayavarman's foolishness broke the lock. Veasna knows that the four Crown fragments, if reassembled by the wrong hands, will not restore the empire but will fully unleash the imprisoned entity upon both realms. She is not trying to reunite the Crown — she is trying to ensure it can never be made whole. The implications of this secret are staggering: if Veasna is right, then every warlord who seeks to reforge the Sacred Crown is unwittingly working toward the destruction of both realms. And the naga, who created the Crown as a prison, are either unwilling or unable to stop them directly, relying instead on cryptic prophecies and a single exiled queen to prevent an apocalypse they themselves failed to prevent the first time.`,
  },

  paladin: {
    name: "Empire of Kiriath",
    leader: "Emperor Kiriath the Eternal Flame",
    motto: "From ashes we rose; to ashes all enemies shall return.",
    backstory: `The Empire of Kiriath was founded in the immediate aftermath of the Shattering by a faction of fire temple priests who believed the catastrophe was divine punishment for the empire's spiritual decay. They saw the Hollow King not as a political problem to be solved but as a sacred wound to be cauterized — a corruption that could only be healed through fire, the purest element, the one that the naga kings themselves revered above all others as the essence of creation.

Emperor Kiriath is the Empire's current ruler, a title he earned not through birthright but through a trial by fire — literally. He walked barefoot across the molten stone of the Phnom Kulen forges to prove his worthiness to the flame priests, and the sacred fires did not consume him, parting around his feet like water around stone. He carries the Sunfire Brand, a massive war-spear forged from jade-infused obsidian that burns with an eternal golden flame said to be a fragment of the original fire that the naga kings used to forge the Sacred Crown itself. The Sunfire Brand is one of the few weapons known to cause lasting harm to the Hollow King's corrupted servants, and Kiriath has used it to destroy three of the Hollow King's temple guardian generals over the course of his reign.

The Empire's military forces are the most fanatically devoted in the shattered lands. Their warriors undergo years of ritual purification before they are allowed to wield jade-forged weapons, ensuring that the stone's corrupting influence is held in check by sacred flame. Their signature units are the Sunfire Guard — heavy infantry wearing obsidian armor inscribed with flame prayers, each warrior wielding a jade-tipped spear that burns with holy fire. The Empire also fields Flame Channelers, specialized priests who can summon pillars of sacred fire from the earth itself, and Ash Walkers — elite scouts who can move through burning terrain without harm, leaving no footprints in the embers. The Empire follows a phoenix philosophy: that destruction and rebirth are one and the same, and that the old world must burn completely before the new one can rise from its ashes.

This philosophy makes the Empire of Kiriath both the most dangerous and the most unpredictable of the four factions. They do not fear loss — they embrace it. Cities they cannot hold are burned rather than surrendered. Jade deposits they cannot protect are detonated with sacred fire rather than left for enemies. Their enemies have learned to fear the scent of smoke on the wind, for where there is smoke, the Ash Walkers are not far behind, and where the Ash Walkers go, nothing green remains.`,
    motivation: `Emperor Kiriath is driven by an unshakable conviction that the Hollow King must be purified by fire — not merely killed, but cleansed of the void's corruption. He believes that destroying the Hollow King outright would release the corrupted jade energy in an uncontrolled burst, causing a second Shattering that would finish what the first one started and perhaps consume both realms entirely. The Empire's mission, as Kiriath sees it, is to gather the four Crown fragments and use them in a sacred flame ritual that will burn away the corruption while preserving the jade's essential power, restoring the Sacred Crown to its true purpose as the bridge between worlds. It is a vision that inspires fanatical devotion in his followers and deep unease in his rivals, for Kiriath's definition of "purification" leaves little room for mercy or compromise. Those who will not embrace the flame, in his eyes, are already part of the void.`,
    secret: `The eternal flames that power the Empire of Kiriath are dying. The sacred fires that once burned with the intensity of the sun now gutter and flicker, weakened by the Hollow King's growing corruption of the jade beneath the earth. Emperor Kiriath has kept this secret from his own people, hiding the weakening flames behind ceremonial veils and increasing the number of prayers and offerings to mask the decline. But he knows the truth: the fires will extinguish entirely within a few short years unless they are rekindled. And the only way to rekindle them is to reunite all four fragments of the Sacred Crown and place them within the original fire temple forge of Phnom Kulen. Kiriath's holy crusade is not merely a quest for power or justice — it is a desperate race against the extinction of everything his empire stands for.`,
  },
};

// ============================================================
// CAMPAIGN CHAPTERS
// ============================================================

export const CAMPAIGN_CHAPTERS: CampaignChapter[] = [
  {
    id: "chapter_1",
    chapterNumber: 1,
    title: "The Stirring of Fragments",
    subtitle: "Where the old empire's echoes first awaken",
    introNarration: `The monsoon winds carry whispers from Phnom Kulen — whispers that the jade beneath the earth is stirring after three generations of silence. For decades, the four warlords have fought over the ruins of the Khmer Empire, each claiming a fragment of the Sacred Crown and a destiny they believe is theirs alone.

But now the land itself is changing. Spirit energies surge through the Mekong's waters, turning them the color of bruised jade. Ancestral voices echo in the crumbling corridors of Angkor Wat, chanting hymns that no living person remembers. And in the border territory of Ironhold, a fortress built from the stones of a fallen temple, something has been unearthed in the deep foundations — a cache of pristine jade, untouched by the Shattering's corruption, humming with power that has not been felt since the empire's golden age. The time for skirmishing is over. The War of the Broken Crown begins in earnest.`,
    victoryNarration: `Ironhold's ancient walls now fly your banner, and the jade cache hidden beneath its foundations pulses steadily under your control. But the victory tastes of ash and old stone.

The jade you recovered hums with a frequency that makes your teeth ache and your ancestors stir in their sleep — the Hollow King's influence is growing stronger, and every fragment of sacred jade across the land is resonating with his corrupted will. The other warlords have taken notice of your ambitions. The old borders will not hold. Move quickly, before the shadows close in and the Hollow King's whispers grow too loud to ignore.`,
    defeatNarration: `Ironhold has fallen to your rivals, its jade caches seized by those with sharper blades or deeper treachery, its strategic position along the Mekong lost.

But defeat in the Khmer lands is rarely final — the spirits of the old empire have a way of offering second chances to those desperate enough to seize them. The ancestors remember those who fight with courage, even in loss. Rebuild your forces, listen to the whispers of the jade, and remember: the Hollow King does not care which warlord wins this battle. He only cares that they are too busy fighting each other to notice him clawing his way back toward the light of the living world.`,
    objectives: [
      "Secure your home territories and establish a defensive foothold",
      "Capture Ironhold and seize the jade cache beneath its foundations",
      "Deploy reinforcements to strengthen border positions along the Mekong",
      "Eliminate at least one rival faction's presence in your region",
      "Build a spirit ward to protect your jade supplies from Hollow King's influence",
    ],
    battleSetup: {
      territoryAssignments: {
        "Ironhold": { ownerId: "neutral", units: ["Spirit Guard", "Jade Archer", "War Elephant"] },
        "Mekong Crossing": { ownerId: "neutral", units: ["River Patrol", "Naga Scout"] },
      },
      bonusReinforcements: 2,
    },
  },

  {
    id: "chapter_2",
    chapterNumber: 2,
    title: "Whispers in the Mist",
    subtitle: "The naga do not forget, and they do not forgive",
    introNarration: `The monsoon mist rolling off the Mekong has grown thick with spirit energy, so dense that travelers lose their way within paces of the road and villages wake to find their boundaries shifted in the night. Those who venture into the mist return changed — speaking in old tongues, carving naga scales into their skin, or simply vanishing altogether, their footprints ending abruptly in pools of jade-tinted water.

Queen Veasna's Shadowlands have expanded deep into the mist-covered lowlands, her spirit-walkers and mist-dancers striking from the fog with devastating precision. But the mist hides more than assassins. Naga spirits have been sighted in the deep pools, their immense serpent forms coiling through the jade-tainted waters, their voices carrying prophecies across the current. They speak of the Hollow King's true nature and the terrible, ancient purpose of the four Crown fragments. Navigate the mist, uncover the naga's secrets, and survive Queen Veasna's deadly shadow games.`,
    victoryNarration: `You have pushed through the spirit-mist and survived Queen Veasna's shadow games, claiming territory rich with naga-touched jade that sings with ancient power. The serpent spirits have shared fragments of forbidden knowledge — visions of what the Hollow King truly is and what will happen if the Crown fragments fall into the wrong hands and are made whole.

The mist is thinning now, the Mekong's waters running clear once more, but the truths the naga revealed will haunt your dreams for seasons to come. The war has entered a new phase, one where knowledge may prove more dangerous than any blade.`,
    defeatNarration: `The mist has swallowed your forces whole. Soldiers who wandered into the fog emerged days later unable to speak, their eyes clouded with jade-green light, their lips moving in silent conversation with things no living person can see.

Veasna's shadow-walkers exploited the chaos, seizing territories you had fought hard to claim and vanishing before you could respond. But even in defeat, the naga whispers linger at the edge of hearing — a reminder that the true war is not between warlords but between the living and the hollow things that wear the shapes of kings and guardians. Some of your soldiers never returned from the mist at all, and those who did speak of vast serpentine shapes moving beneath the jade-tinted waters, watching, waiting, as if the naga themselves were judging whether this war is worth fighting.`,
    objectives: [
      "Push through the spirit-mist and secure the Mekong lowlands",
      "Survive Veasna's ambushes and counter her shadow tactics",
      "Locate and commune with the naga spirits in the deep pools",
      "Capture territory containing naga-touched jade deposits",
      "Uncover the naga prophecy about the true nature of the Crown fragments",
    ],
    battleSetup: {
      territoryAssignments: {
        "Mist Village": { ownerId: "veasna", units: ["Mist Dancer", "Spirit Walker", "Naga Bound Spy"] },
        "Deep Pool Shrine": { ownerId: "neutral", units: ["Naga Spirit Guardian", "Jade Serpent"] },
      },
      bonusReinforcements: 2,
    },
  },

  {
    id: "chapter_3",
    chapterNumber: 3,
    title: "The Storm Breaks",
    subtitle: "When the sky itself takes sides, no wall can save you",
    introNarration: `Lord Chanreth has summoned the Great Monsoon — a storm of such fury that it has not been seen since the night of the Shattering itself, when the naga kings first vented their wrath upon the land. Lightning cracks across the eastern highlands in continuous sheets, turning night into day and day into a blinding white hell. The wind howls with the voices of a thousand ancestor spirits, all of them screaming Chanreth's name.

Chanreth's battlemages ride the storm winds like surfers on a tidal wave, striking with jade lightning that can shatter fortress walls, split war elephants in two, and turn rivers to steam in an instant. The Stormrealm is on the march, and Chanreth will not stop until his vision of a restored spirit-mortal bond is imposed upon the shattered empire — by thunder, by lightning, and by overwhelming force. Cross the lightning-fields, weather the storm, and prove that your will is stronger than the sky's fury.`,
    victoryNarration: `The Great Monsoon has broken against your determination like waves against the ancient temple walls of Angkor Wat — walls that were built to endure the wrath of gods and have outlasted them all. Chanreth's storm temples are yours, their jade resonators now humming under your command, their sacred archives open to your scholars.

The lightning has faded to a gentle, cleansing rain, and in its aftermath, the spirit energy that Chanreth unleashed has settled into the land like nourishing dew. The mountain monasteries, once shrouded in perpetual storm, are now visible for the first time in a generation — ancient stone spires dusted with snow and etched with prayers to the naga kings. But the storm's true lesson lingers: the spirit world is not a resource to be exploited but a force to be respected, and the Hollow King stirs more violently with each passing day as the barrier between worlds grows ever thinner.`,
    defeatNarration: `The storm has scattered your forces like dry leaves before a typhoon. Chanreth's Lightning Speakers carved through your formations with surgical precision, each bolt guided by ancestor spirits who knew exactly where your defenses were weakest.

The Wind Walkers struck from directions that should not have been possible — riding air currents that twisted through your ranks like serpents. Your war elephants panicked in the electrical storms, trampling your own infantry in their terror. But the rain will pass, the land will dry, and armies can be rebuilt from the surviving remnants. The sky may have chosen Chanreth this day, but skies change with the seasons.`,
    objectives: [
      "Survive the Great Monsoon and push into Chanreth's highland territories",
      "Capture at least two storm temples to disrupt Chanreth's power base",
      "Protect your war elephants from jade lightning strikes using spirit wards",
      "Defeat or drive back Chanreth's battlemage corps",
      "Secure the storm temple archives before they can be destroyed or hidden",
    ],
    battleSetup: {
      territoryAssignments: {
        "Storm Peak": { ownerId: "chanreth", units: ["Lightning Speaker", "Wind Walker", "Storm Elephant"] },
        "Cloud Monastery": { ownerId: "chanreth", units: ["Monsoon Bringer", "Temple Monk", "Jade Resonator"] },
      },
      bonusReinforcements: 3,
    },
  },

  {
    id: "chapter_4",
    chapterNumber: 4,
    title: "Ashes of the Old World",
    subtitle: "The fire that purifies also consumes",
    introNarration: `The volcanic lowlands surrounding the Fire Temples of Kiriath burn day and night, rivers of molten stone carving glowing channels through a landscape of obsidian and ash. Emperor Kiriath has declared a holy crusade, his Sunfire Guard marching outward from the Sunfire Citadel — a fortress forged from molten stone at the heart of the volcanic fields, its walls radiating heat that can be felt from a day's march away.

Kiriath's warriors are the most fanatical in the shattered empire, fighting with a zeal that borders on madness, their jade-tipped spears burning with sacred fire that leaves nothing but white ash where enemies once stood. But Kiriath's crusade masks a desperation that his people must never discover: the eternal flames are dying, the sacred fires that have burned for nine centuries guttering and dimming with each passing season. Only the Sacred Crown's restoration can save them.

Scouts report that the volcanic lowlands have grown more unstable in recent weeks — new fissures opening in the earth, geysers of jade-tinted steam erupting without warning, and the distant sound of the Sunfire Citadel's war horns echoing across the ash plains day and night. Kiriath is calling every warrior to the flames. This is not merely a defense — it is a final stand. Traverse the hellscape, breach the obsidian walls, and confront a dying empire's final, most terrible fury.`,
    victoryNarration: `The Sunfire Citadel's obsidian walls lie cracked and smoking, their sacred fires dimmed but not extinguished, and Emperor Kiriath's forces have been driven back to the inner sanctums where the last embers still glow.

But victory here carries a bitter revelation: the eternal flames that have burned since the naga kings first kindled them are guttering and dim, their sacred light fading as the Hollow King's corruption seeps deeper into the jade veins beneath the earth. Kiriath's desperation is now your burden — without the flames, the last barrier between the mortal world and the Hollow King's void will fall, and the spirits of the old empire will have nowhere left to anchor themselves. The final confrontation draws near, and it must happen soon, before the last flame goes dark.`,
    defeatNarration: `Kiriath's sacred fire has consumed your advancing armies like dry timber. The Sunfire Guard fought with the desperate fury of warriors who know they are defending the last light in a darkening world, their jade spears burning through your strongest shields and turning your war elephants into screaming torches.

The volcanic lands remain in Kiriath's grip, and the eternal flames — whatever remains of them — continue to cast their dying, golden glow across the ash-choked plains. But even empires built on fire eventually run out of fuel, and the Hollow King's corruption will reach these flames soon enough. Regroup, gather your strength, and strike again when the fires are weaker.`,
    objectives: [
      "Advance through the volcanic lowlands toward the Sunfire Citadel",
      "Breach the obsidian fortress walls and engage the Sunfire Guard",
      "Protect your forces from sacred fire attacks and Flame Channelers",
      "Uncover the truth about the dying eternal flames",
      "Decide whether to aid or exploit Kiriath's desperate situation",
    ],
    battleSetup: {
      territoryAssignments: {
        "Lava Fields": { ownerId: "kiriath", units: ["Flame Channeler", "Ash Walker", "Sunfire Guard"] },
        "Obsidian Gate": { ownerId: "kiriath", units: ["Sunfire Guardian", "Jade Pyromancer", "War Elephant"] },
      },
      bonusReinforcements: 3,
    },
  },

  {
    id: "chapter_5",
    chapterNumber: 5,
    title: "The Hollow King Awakens",
    subtitle: "Beneath Phnom Kulen, the void opens its crown",
    introNarration: `The ground beneath Phnom Kulen is splitting apart, and from the fissures pours a darkness that swallows light and silences sound. The mountain itself groans, its ancient stones shifting like the scales of some enormous serpent stirring in its sleep.

The Hollow King is awakening — fully, completely, for the first time since the Shattering. King Jayavarman the Unbroken, or what remains of him, stirs in the deep caverns beneath the sacred mountain, and his corrupted will pulses outward through every shard of jade in the empire, making the stone sing and the spirits scream. The corrupted Temple Guardians march from the mountain's roots in silent, terrible formation, their ceremonial armor fused with flesh and stone, their jade-cursed weapons burning with hollow green fire that leaves no bodies, only shadows.

The four warlords must set aside their rivalries and descend into the ancient fire temples one final time, past the forges where the Sacred Crown was first made, past the altars where the naga kings once blessed the jade, to the deepest chamber where a void wearing a king's face sits upon a throne of corrupted crystal. Below lies the Hollow King, the four fragments of the Sacred Crown, and the choice that will determine whether the Khmer Empire rises again or is consumed by the void forever.`,
    victoryNarration: `The Hollow King falls. Not easily, not cleanly, not without sacrifice — warriors you loved lie broken among the ancient stones, their spirits joining the jade chorus that fills the caverns with a sound like weeping and triumph intertwined. But he falls.

The Sacred Crown's four fragments, reunited at last within the original forge of Phnom Kulen, blaze with a light that has not been seen since the empire's golden age — a light so pure it burns away the corruption, dissolving the void that wore Jayavarman's face into mist and silence and blessed nothingness. For a single, breathtaking moment, the naga kings themselves appear in the forge's depths, their serpent forms coiling through the sacred light, their ancient voices chanting a hymn of sealing that resonates through both realms. Above ground, the spirit mist recedes from the Mekong. The monsoon rains return to their natural rhythm. And in the distance, rising from the jungle like a lotus from dark water, the towers of Angkor Wat begin to glow with a faint, emerald light. The war is over. What rises from its ashes is yours to shape.`,
    defeatNarration: `The Hollow King stands victorious atop the broken forge of Phnom Kulen, the four Crown fragments orbiting his twisted form like vengeful moons. Your armies lie shattered among the ancient stones, their jade weapons dark and silent, the sacred flames extinguished.

The Hollow King does not gloat or celebrate — he simply reaches outward with hands that are not quite hands, and the jade in the earth answers his call, surging toward him in rivers of green fire that illuminate the caverns like the belly of some terrible beast. But this is not the end. The Crown fragments remain scattered, the naga still watch from the deep pools, and the embers of the eternal flames have not yet gone completely cold. Rise again. The Khmer Empire was built to endure nine centuries of glory; it can survive a single defeat. So can you.`,
    objectives: [
      "Descend into the caverns beneath Phnom Kulen and survive the descent",
      "Fight through the corrupted Temple Guardians to reach the Hollow King's chamber",
      "Gather or claim all four fragments of the Sacred Crown",
      "Defeat the Hollow King and restore or destroy the Sacred Crown in the forge",
      "Choose the fate of the Khmer Empire — restoration or a new beginning",
    ],
    battleSetup: {
      territoryAssignments: {
        "Phnom Kulen Summit": { ownerId: "hollow_king", units: ["Corrupted Guardian", "Jade Wraith", "Void Sentinel"] },
        "Fire Temple Depths": { ownerId: "hollow_king", units: ["Hollow Guardian", "Spirit Eater", "Crown Phantom"] },
        "Crown Forge": { ownerId: "hollow_king", units: ["Hollow King", "Royal Jade Guardian", "Void Herald"] },
      },
      bonusReinforcements: 5,
    },
  },
];

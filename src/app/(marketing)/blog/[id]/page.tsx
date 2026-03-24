import Link from 'next/link'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return Array.from({ length: 12 }, (_, i) => ({ id: String(i + 1) }))
}

// ── TYPES ──────────────────────────────────────────────────────────────────────
interface Section {
  heading: string
  body: string[]
  tips?: string[]
  myth?: string
  relatable?: string
  quote?: string
}

interface Article {
  id: number
  title: string
  tag: string
  emoji: string
  color: string
  accent: string
  date: string
  readTime: string
  hook: string
  keyInsight: string
  sections: Section[]
  cta?: string
}

// ── ARTICLE DATA ────────────────────────────────────────────────────────────────
const ARTICLES: Record<number, Article> = {
  1: {
    id: 1,
    title: 'Why to-do lists fail ADHD brains (and what to do instead)',
    tag: 'Productivity',
    emoji: '🧠',
    color: '#F0FDF4',
    accent: '#16A34A',
    date: 'March 10, 2026',
    readTime: '6 min read',
    hook: "You wrote the list. You even color-coded it. And by 4pm you have not touched a single item while somehow spending two hours reorganizing your desk. This is not a motivation problem. It is a neuroscience problem.",
    keyInsight: "ADHD is fundamentally a disorder of doing what you know, not knowing what to do. You know the tasks. The brain cannot bridge the gap between intention and action. A to-do list does nothing to help that gap.",
    sections: [
      {
        heading: "The working memory gap",
        body: [
          "ADHD is a disorder of executive function, and working memory is one of the most affected systems. Dr. Russell Barkley describes ADHD as a disorder of self-regulation toward time. A 2025 paper in World Psychiatry confirms that ADHD involves structural and functional differences in prefrontal circuits — the very brain hardware needed to execute a to-do list.",
          "A to-do list asks your brain to spontaneously generate motivation, sequence tasks, estimate time, and initiate action. These are precisely the functions ADHD impairs. When you write the task and close the app, the task ceases to exist in your mind. When you re-open it two days later, it feels like something a stranger wrote.",
        ],
      },
      {
        heading: "The activation problem",
        body: [
          "For people with ADHD, the activation threshold for starting tasks is dramatically higher. It is not that you do not want to do the task. It is that your brain does not produce enough dopamine to initiate action without a compelling trigger — and a static list provides zero triggers.",
          "ADHD brains are wired to respond to novelty, urgency, challenge, interest, or passion. A static list loses novelty the moment you write it. By day two, it is invisible.",
        ],
        quote: "The ADHD brain lives in 'now' and 'not now.' A task due in an hour does not exist until it becomes urgent right this second.",
      },
      {
        heading: "What actually works instead",
        body: [
          "The solution is not a better list. It is a system that creates the external triggers your brain cannot generate internally.",
        ],
        tips: [
          "Time-block, do not list. Assign each task a specific time slot, turning abstract intentions into calendar commitments. The time becomes the trigger.",
          "Use implementation intentions. 'When I sit down after breakfast, I will open the task and spend 5 minutes on it.' These if-then scripts bypass the activation barrier automatically.",
          "Put your most important task on a physical sticky note on your monitor. Not in an app. On your monitor. Visibility is activation.",
          "Gamify with immediate rewards. When tasks have visible reward mechanisms (like growing a virtual tree), the dopamine pathway activates more reliably.",
          "Use accountability. Body doubling, check-ins, and public commitments externalize the motivation your brain cannot generate on its own.",
        ],
      },
      {
        heading: "The myth worth busting",
        body: [],
        myth: "'ADHD people are just lazy and disorganized.' The reality: they are often highly intelligent people using enormous mental energy to compensate for a neurological initiation deficit. A longer, neater list will never fix a wiring issue.",
        relatable: "The r/ADHD thread 'The to-do list that haunts me' has thousands of upvotes from people describing identical lists from weeks ago, untouched — yet they somehow deep-cleaned their bathroom at 2am. If that is you, it is not failure. It is biology.",
      },
    ],
    cta: "Dopamind turns your tasks into timed focus sessions with visual tree rewards. Try it free for 14 days.",
  },

  2: {
    id: 2,
    title: 'What is body doubling and why it works for ADHD',
    tag: 'Focus',
    emoji: '🤝',
    color: '#EFF6FF',
    accent: '#2563EB',
    date: 'March 5, 2026',
    readTime: '5 min read',
    hook: "Sit next to someone and watch your productivity multiply. It sounds too simple to be real. But for ADHD brains, body doubling is one of the most consistently effective strategies ever discovered — and the science behind it is more fascinating than you would expect.",
    keyInsight: "Body doubling works even when the other person is on the other side of a screen, doing something completely unrelated to your work. Virtual co-working communities report this works just as reliably as in-person presence. Your brain does not need supervision — it needs social presence.",
    sections: [
      {
        heading: "What is body doubling?",
        body: [
          "Body doubling is the practice of working alongside another person — in person or virtually — even if neither of you is working on the same task or interacting in any way. The other person's presence serves as an anchor.",
          "The term comes from ADHD coaching literature and was used informally in ADHD communities for years before researchers began studying it. A 2023 ACM SIGACCESS study by neurodivergent researchers established a continuum model of body doubling, examining how space, time, and mutuality interact. A 2024 study confirmed it is effective for initiating and completing tasks in individuals with ADHD.",
        ],
      },
      {
        heading: "Why the presence of another person helps",
        body: [
          "Several mechanisms appear to be at play simultaneously:",
        ],
        tips: [
          "Arousal regulation: ADHD brains are chronically underaroused in the prefrontal cortex. Another person's presence creates mild background arousal that brings brain activation to a level where focus becomes possible.",
          "Social accountability: Even without speaking, you are aware someone might observe you. This activates social monitoring systems that can override default task-avoidance patterns.",
          "Behavioral mirroring: When someone near you is working, mirror neurons fire in response. Their focused state creates a subtle pull toward focused behavior in you.",
          "Emotional regulation: Many adults with ADHD report isolation dramatically worsens their symptoms. The emotional regulation benefit of presence reduces anxiety-driven avoidance.",
        ],
      },
      {
        heading: "How to use body doubling today",
        body: [
          "You do not need a dedicated body doubling service to start. Here are the most effective approaches:",
        ],
        tips: [
          "Use Focusmate or similar platforms. Book a 25, 50, or 75-minute session with a stranger. The commitment effect alone improves follow-through significantly.",
          "Silent video call with a friend. You do not need to talk. Just work on your own things on a shared call.",
          "Work at a coffee shop or library. Background people count as body doubles.",
          "Use 'Study With Me' YouTube videos with ambient sound. One-sided body doubling works better than nothing.",
          "Use Dopamind's Body Double rooms to find others working in real-time on their ADHD tasks.",
        ],
      },
      {
        heading: "The community has known this for years",
        body: [],
        myth: "'You just need the distraction of someone watching you.' Actually, the effect occurs even when the body double is not watching at all — suggesting it is about social presence and neurochemical priming, not observation-driven anxiety.",
        relatable: "On r/ADHD, the post 'Anyone else literally cannot work alone but can get everything done at a coffee shop?' has been posted in some variation hundreds of times. You are not weird. Your brain is responding to biology.",
      },
    ],
    cta: "Dopamind's Body Double rooms connect you with others working on ADHD tasks in real time. Try it free.",
  },

  3: {
    id: 3,
    title: 'ADHD medication: what the research actually says',
    tag: 'Treatment',
    emoji: '💊',
    color: '#FFF7ED',
    accent: '#EA580C',
    date: 'Feb 28, 2026',
    readTime: '7 min read',
    hook: "Medication is one of the most misunderstood topics in the ADHD conversation. People either dismiss it entirely ('it just makes you a zombie') or treat it as a magic cure. The science says something more nuanced, more honest, and ultimately more useful.",
    keyInsight: "The evidence base for stimulant medications is among the strongest in all of psychiatry. A 2024 Lancet Psychiatry meta-analysis examining pharmacological interventions for adult ADHD found that stimulants consistently outperformed placebo with medium-to-large effect sizes. This is not a controversial finding anymore.",
    sections: [
      {
        heading: "What the research actually shows",
        body: [
          "A landmark 2024 systematic review published in The Lancet Psychiatry examined pharmacological, psychological, and neurostimulatory interventions for adult ADHD. Stimulants — specifically amphetamines (Adderall, Vyvanse) and methylphenidate (Ritalin, Concerta) — consistently outperformed all other interventions on core ADHD symptoms.",
          "A 2024 meta-analysis in the Journal of the American Academy of Child and Adolescent Psychiatry found these medications significantly improved quality of life, not just clinical symptom scores. A 2026 Nature review also revised our understanding of how stimulants work: rather than acting purely on attention circuitry, they appear to act primarily on the brain's reward and wakefulness centers — explaining why they help ADHD brains initiate effort on tasks that feel unrewarding.",
        ],
      },
      {
        heading: "What medication actually does",
        body: [
          "Medication does not make you a different person. What it does, for many people, is remove the neurological static so the person you already are can function. The ADDitude Magazine community frequently describes it as 'putting on glasses for your brain.'",
          "Neuroimaging research shows ADHD individuals experience stimulants differently from neurotypical people. For ADHD brains, stimulants normalize dopamine signaling rather than creating euphoria. Abuse potential is real but significantly lower when medication is properly prescribed and monitored.",
        ],
        quote: "I took it and for the first time in 30 years, I did the dishes without a three-hour battle in my head first. — r/ADHD community",
      },
      {
        heading: "Practical guidance for your doctor appointment",
        body: [],
        tips: [
          "Track symptom response carefully. Keep a log in the first weeks: what time you took medication, what you accomplished, when it wore off, any side effects. This data makes follow-ups productive.",
          "Medication is not enough alone. Research consistently shows combined medication plus behavioral strategies outperforms medication alone, especially for long-term outcomes.",
          "Non-stimulant options are real. Atomoxetine (Strattera) and viloxazine are evidence-backed alternatives for those who experience anxiety, side effects, or have contraindications. Ask explicitly.",
          "Timing matters. Many adults take medication too late in the morning, missing the window when executive function demands are highest.",
        ],
      },
      {
        heading: "The myth worth addressing",
        body: [],
        myth: "'ADHD medication is just speed and anyone taking it gets high.' Neuroimaging research shows ADHD and non-ADHD brains respond to stimulants very differently. For ADHD brains, stimulants normalize dopamine signaling. The 'high' response is a sign of a brain that did not need the medication.",
        relatable: "The most upvoted sentiment across ADHD medication threads: 'I took it and for the first time in 30 years I did the dishes without a three-hour internal battle.' That is not a high. That is a brain finally getting to function.",
      },
    ],
    cta: "Dopamind complements your ADHD treatment plan with focus timers, task management, and progress tracking designed for ADHD brains.",
  },

  4: {
    id: 4,
    title: 'Time blindness: the ADHD symptom nobody talks about',
    tag: 'Awareness',
    emoji: '⏰',
    color: '#FDF4FF',
    accent: '#9333EA',
    date: 'Feb 20, 2026',
    readTime: '6 min read',
    hook: "You sat down to 'quickly check your email.' Two hours later you are 40 tabs deep into the history of Byzantine architecture and you have missed your meeting. This is not carelessness. It is time blindness, and Dr. Russell Barkley argues it is central to understanding ADHD itself.",
    keyInsight: "Barkley's framework distinguishes two types of time estimation that ADHD brains struggle with: retrospective (how much time has passed) and prospective (how long something will take). For people with ADHD, time collapses into just two categories: 'now' and 'not now.' A meeting in 20 minutes does not exist until it is happening.",
    sections: [
      {
        heading: "The neuroscience of ADHD time perception",
        body: [
          "In his 1997 foundational paper on ADHD and self-regulation, Barkley introduced 'temporal myopia' — nearsightedness toward time. His research, refined over three decades, shows ADHD adults struggle most with prospective time estimation: how long something will take in the future. This explains chronic lateness, missed deadlines, and the eternal 'I just need five more minutes.'",
          "Neurologically, this is linked to executive function deficits in the prefrontal cortex. Emerging research also implicates the cerebellum, a structure involved in temporal processing of sequences and rhythms. This is not carelessness. It is a structural brain difference.",
        ],
        quote: "For the ADHD brain, time is not a continuous flow. It is either 'now' or it is 'not now' — and 'not now' effectively does not exist until it becomes now.",
      },
      {
        heading: "The real-world impact",
        body: [
          "Barkley's 2004 research offered a stark finding: ADHD time blindness can reduce life expectancy by 11 to 13 years through its downstream effects. This is not about being occasionally late. It is a chronic inability to plan for future consequences that compounds across every life domain — career, health, relationships, finances.",
        ],
      },
      {
        heading: "What actually helps",
        body: [],
        tips: [
          "Make time visible. Use analog clocks rather than digital ones. The 'Time Timer' — a clock that shows time depleting as a red disk — is widely recommended by ADHD coaches because it makes time physically perceivable rather than abstract.",
          "Use transition alarms, not just reminders. Set an alarm 15 minutes before you need to leave, not just at departure time. Build transition time explicitly into every schedule.",
          "Time your tasks for two weeks. Use a stopwatch to track how long everyday tasks actually take. This calibrates your prospective estimation and reduces chronic underplanning.",
          "Never trust your gut estimate — double it. Research shows ADHD adults consistently underestimate task duration by 40-60%. Build in a doubling rule as a default.",
        ],
      },
      {
        heading: "It is not disrespect",
        body: [],
        myth: "'You would be on time if you really cared.' Research shows ADHD individuals frequently care deeply and feel intense shame about lateness, which actually worsens performance through emotional flooding. The solution is external systems, not stronger feelings.",
        relatable: "The r/ADHD experience of thinking 'I have plenty of time,' then suddenly being 25 minutes late to something that started 10 minutes ago has been described so precisely and so often that it has its own recurring meme format in the community.",
      },
    ],
    cta: "Dopamind's visual focus timer makes time visible and real for ADHD brains. Try it free — no credit card needed.",
  },

  5: {
    id: 5,
    title: 'ADHD and rejection sensitive dysphoria explained',
    tag: 'Wellbeing',
    emoji: '❤️',
    color: '#FFF1F2',
    accent: '#E11D48',
    date: 'Feb 14, 2026',
    readTime: '8 min read',
    hook: "You received a mildly critical comment in a meeting. By that evening you are replaying it on loop, convinced you are incompetent, everyone dislikes you, and you should quit. Your partner used a slightly irritated tone and your body flooded with physical pain. You know it is disproportionate. You cannot stop it. This is rejection sensitive dysphoria.",
    keyInsight: "RSD is one of the most universally recognized experiences in the ADHD community, yet it is not in the DSM. Dr. William Dodson, who coined the term, chose 'dysphoria' — Greek for 'unbearable' — intentionally. The emotional pain of perceived rejection in ADHD can genuinely be that severe.",
    sections: [
      {
        heading: "What RSD actually is",
        body: [
          "Rejection sensitive dysphoria refers to extreme emotional sensitivity triggered by the perception of rejection, criticism, failure, or teasing. The key word is perception. The rejection does not need to be real. A neutral face, a short reply, or being left on read can trigger a full emotional crisis.",
          "From a neuroscience perspective, RSD is rooted in emotional dysregulation — increasingly recognized as a core feature of ADHD rather than a comorbidity. The same prefrontal cortex deficits that impair task initiation also impair the regulation of emotional responses. The brain's 'emotion brake' is weaker in ADHD.",
        ],
      },
      {
        heading: "Why RSD is often more disabling than 'classic' ADHD",
        body: [
          "RSD drives career avoidance (never trying for roles for fear of failure), relationship difficulties (interpreting neutral behavior as rejection), and is a major factor in the high rates of anxiety and depression seen in ADHD adults. Many adults with ADHD structure their entire lives around avoiding situations where RSD might be triggered — which can severely limit their world.",
        ],
        quote: "The physical sensation of RSD has been described by thousands of ADHD adults as 'a punch to the chest' or 'my stomach dropping through the floor.' That language is not hyperbole. It reflects the actual intensity of the experience.",
      },
      {
        heading: "Managing RSD day to day",
        body: [],
        tips: [
          "Name it in the moment. When a wave of intense emotion hits, saying 'this might be RSD' creates a small cognitive gap between the feeling and the reaction. It does not eliminate the pain, but it prevents escalation.",
          "Discuss RSD with your prescriber. Some adults report significant RSD relief with ADHD medication, particularly alpha-agonists like guanfacine, though evidence is still emerging.",
          "Therapy focused on identity, not just behavior. CBT adapted for ADHD and schema therapy can help address the deeply held belief of being 'fundamentally flawed' that RSD reinforces over time.",
          "Build a personal rejection response protocol. Agree with yourself in advance: when intense rejection feelings hit, you will wait 24 hours before responding to any message, quitting any job, or ending any relationship.",
        ],
      },
      {
        heading: "The myth that causes the most damage",
        body: [],
        myth: "'You are just too sensitive and need to toughen up.' RSD is neurological, not a character flaw. Telling someone with RSD to be less sensitive is like telling a colorblind person to see red. Understanding the mechanism creates compassion — both for yourself and from others.",
        relatable: "One widely shared post: 'I misread a text as cold and spent six hours in emotional agony. The sender was just tired. This is ADHD, not drama.' That post resonated with hundreds of thousands of ADHD adults who recognized themselves in every word.",
      },
    ],
    cta: "Understanding your ADHD is the first step. Dopamind helps you build daily systems that work with your brain, not against it.",
  },

  6: {
    id: 6,
    title: 'The Pomodoro technique for ADHD: does it actually work?',
    tag: 'Focus',
    emoji: '🍅',
    color: '#ECFDF5',
    accent: '#059669',
    date: 'Feb 8, 2026',
    readTime: '5 min read',
    hook: "The Pomodoro technique is everywhere in productivity culture: 25 minutes of focused work, a 5-minute break, repeat four times, then take a longer break. Simple. Clean. Structured. But does it actually work for ADHD brains? The answer is: sometimes, for some people, but almost never as prescribed out of the box.",
    keyInsight: "The 25-minute Pomodoro interval is poorly suited to many ADHD adults. Research and practitioner experience consistently note that ADHD brains often need 10-15 minutes just to reach a flow state — meaning a 25-minute block cuts off focus right when it finally arrives.",
    sections: [
      {
        heading: "Why the structure helps",
        body: [
          "A 2021 study in the Journal of Clinical Psychology found that structured time-blocking techniques, including Pomodoro-style approaches, improved task completion rates by 27% among adults with ADHD compared to unstructured work periods.",
          "The theory behind why it helps ADHD brains is solid: Pomodoro externalizes two things ADHD brains struggle to regulate internally — time and transitions. The ticking timer makes time visible, addressing time blindness directly. The forced breaks prevent the zombie scrolling that follows mental exhaustion. The defined work blocks reduce initiation paralysis because you are only committing to 25 minutes, not the entire project.",
        ],
      },
      {
        heading: "Why 25 minutes is wrong for most ADHD brains",
        body: [
          "The 25-minute interval was designed by Francesco Cirillo, a neurotypical person, for neurotypical work patterns. Neurotypical brains can reach productive focus relatively quickly. ADHD brains typically need 10-15 minutes of warming up before they hit any kind of flow.",
          "The result: just as your ADHD brain is finally locked in and productive, the alarm goes off and you are supposed to stop. Many ADHD adults report this as their most hated productivity experience.",
        ],
        quote: "I was FINALLY in it and the timer said stop. I wanted to throw my phone across the room. — r/ADHD",
      },
      {
        heading: "How to adapt Pomodoro for ADHD",
        body: [],
        tips: [
          "Calibrate your own interval. Track when you typically hit your focus groove. If it takes 15 minutes to warm up, a 45-50 minute block with a 10-minute break suits you better than 25/5.",
          "Use a visual timer. A physical Time Timer or visual digital timer makes the interval feel real. The ticking of a standard kitchen timer also works as an auditory anchor.",
          "Protect your breaks strictly. The Pomodoro break is not optional. ADHD brains are especially prone to pushing past exhaustion then crashing. Five genuine rest minutes, away from screens, is more restorative than it sounds.",
          "Stack Pomodoro with body doubling. The Focusmate platform essentially runs virtual Pomodoros with a real accountability partner. The combination of time structure and social presence is more powerful than either alone.",
        ],
      },
      {
        heading: "The real lesson",
        body: [],
        myth: "'If Pomodoro does not work for you, you have no self-control.' Pomodoro was designed for a different brain. ADHD adults are not failing the technique. The technique needs adapting for them.",
        relatable: "Dopamind offers focus timer presets at 5, 15, 25, 45, and 60 minutes precisely because there is no single right interval for ADHD brains. The right session length is the one that matches how your brain actually works today.",
      },
    ],
    cta: "Dopamind's focus timers let you pick your own interval and grow a virtual tree when you complete each session. Try it free.",
  },

  7: {
    id: 7,
    title: "Executive dysfunction: why you can't just 'try harder'",
    tag: 'Awareness',
    emoji: '⚡',
    color: '#F0FDF4',
    accent: '#16A34A',
    date: 'Feb 2, 2026',
    readTime: '6 min read',
    hook: "You have sat at your desk for three hours. The email is three sentences long. You know exactly what to say. You cannot type it. This is not laziness. This is executive dysfunction, and it is perhaps the most misunderstood and unfairly judged aspect of ADHD.",
    keyInsight: "Trying harder is neurologically counterproductive for ADHD. Stress and frustration elevate cortisol, which further suppresses prefrontal activity — the exact opposite of what you need. People with ADHD are often working three times harder than neurotypical peers just to produce the same output.",
    sections: [
      {
        heading: "What executive function actually is",
        body: [
          "Executive functions are the cluster of mental processes that allow you to plan, initiate, regulate, and complete goal-directed behavior. They include working memory, cognitive flexibility, inhibitory control, task initiation, and emotional regulation — all managed primarily by the prefrontal cortex.",
          "Research published in Frontiers in Psychiatry (2023) confirms that ADHD involves underactivation of dopaminergic D1 receptors and noradrenergic alpha-2A receptors, and delayed cortical maturation in key executive function regions. Brain imaging studies show reduced gray matter volume in the prefrontal cortex and less efficient connectivity between the PFC and regions involved in motivation and reward.",
        ],
      },
      {
        heading: "Why 'try harder' makes it worse",
        body: [
          "Dr. Russell Barkley's unified theory frames ADHD not as an attention disorder but as a disorder of self-regulation. The problem is not that ADHD people cannot pay attention — it is that they cannot regulate when and how their attention is directed.",
          "Telling an ADHD brain to try harder under stress is like telling someone with a broken leg to run faster. The stress actually suppresses the prefrontal function you need. The shame and frustration that come from chronic 'trying harder and failing' compound over years into anxiety, depression, and a deep internalized belief of being broken.",
        ],
        quote: "The person who cannot write a three-sentence email can spend six focused hours on a project they find genuinely compelling. That is not preference. That is neurobiology.",
      },
      {
        heading: "What actually bypasses executive dysfunction",
        body: [],
        tips: [
          "Design your environment to do the executive work. Remove decisions, create visual cues, and minimize friction. Environmental structure replaces internal regulation you cannot reliably generate.",
          "Use if-then implementation intentions. 'When I sit down at my desk, I will open my document before checking my phone.' Research shows these simple scripts can bypass the initiation barrier by automating the first step.",
          "Lower the activation energy ruthlessly. The hardest part of any task is starting. The goal is not to finish the whole task — it is to do just enough to be in motion. Motion sustains itself better than starts.",
          "Work with interest, urgency, or novelty. ADHD executive function activates best when these signals are present. Gamify tasks, set artificial deadlines, or introduce novel elements.",
        ],
      },
      {
        heading: "What you deserve to hear",
        body: [],
        myth: "'ADHD people can focus when they want to, so they could focus on boring things too if they tried.' Executive dysfunction is not selective willfulness. The person who can hyperfocus for 6 hours cannot turn that on demand for tasks that do not trigger dopamine. That is not laziness. That is how the brain works.",
        relatable: "The r/ADHD post 'I need to send one email. It has been six weeks.' has accumulated tens of thousands of upvotes and hundreds of replies from people who understand exactly what that sentence means. If you are one of them, you are not alone and you are not broken.",
      },
    ],
    cta: "Dopamind is designed around how ADHD brains actually work — with visual timers, gamified rewards, and zero judgment. Try it free.",
  },

  8: {
    id: 8,
    title: 'Dopamine and ADHD: the real neuroscience explained',
    tag: 'Neuroscience',
    emoji: '🔬',
    color: '#FFF7ED',
    accent: '#D97706',
    date: 'Jan 27, 2026',
    readTime: '7 min read',
    hook: "When people talk about dopamine, they usually mean the pleasure chemical — the thing that makes food, social media, and new purchases feel good. But dopamine's role in ADHD is more specific and more fundamental than that. And misunderstanding it leads to misunderstanding the condition entirely.",
    keyInsight: "ADHD is not a dopamine deficiency. It is more precisely described as dopamine dysregulation: reduced receptor sensitivity, altered transporter function, and weaker reward prediction signals. The brain has dopamine. It just cannot use it as efficiently or predictably as neurotypical brains can.",
    sections: [
      {
        heading: "What the neuroscience actually shows",
        body: [
          "A comprehensive 2024 review published in Frontiers in Psychiatry examined over 40 years of research on dopamine and ADHD, pulling from nearly 3,000 publications and 39 meta-analyses. The conclusion: ADHD involves dysfunction in the dopamine reward pathway, specifically in how dopamine signals anticipation, motivation, and the drive to initiate behavior.",
          "The key pathway is the mesoaccumbens system, projecting from the ventral tegmental area (VTA) to the nucleus accumbens. This is the brain's motivation engine. Functional MRI studies show decreased nucleus accumbens activation when people with ADHD process reward signals — meaning the brain's 'this is worth doing' signal is quieter, less reliable, and harder to sustain.",
        ],
      },
      {
        heading: "Why this creates an interest-based attention system",
        body: [
          "Tasks that are novel, immediately rewarding, competitive, urgent, or personally meaningful can generate sufficient dopamine activation to produce focused, even brilliant work. Tasks that are routine, delayed-reward, or externally imposed often cannot.",
          "This is not a choice. The neurochemical signal to start simply does not fire with the same intensity for uninteresting tasks. The person is not choosing to ignore boring work. Their dopamine system is literally not signaling sufficient motivation to engage.",
        ],
        quote: "ADHD is not a deficit of attention. It is a deficit of motivation-to-attend. The attention is available — it just only deploys reliably for things that fire dopamine.",
      },
      {
        heading: "Using this knowledge to your advantage",
        body: [],
        tips: [
          "Anchor routine tasks to dopamine triggers. Listen to your favorite music, a podcast, or an audiobook only while doing low-interest tasks. You are borrowing dopamine from a high-interest activity to fuel a low-interest one.",
          "Use immediate micro-rewards. Delayed gratification is a dopamine desert for ADHD brains. Build in small, immediate rewards after sub-tasks rather than waiting until the whole project is done. Growing a tree works.",
          "Introduce novelty deliberately. Change your work environment, use a new tool, frame the same task differently. Novelty is one of the most reliable dopamine triggers for ADHD brains.",
          "Exercise before demanding tasks. Aerobic exercise reliably increases dopamine, norepinephrine, and serotonin. Even 10 minutes of brisk walking improves executive function measurably for hours afterward.",
        ],
      },
      {
        heading: "The myth that causes the most harm",
        body: [],
        myth: "'ADHD people just want constant stimulation because they are immature.' The stimulation-seeking that looks like immaturity is actually a dopamine-starved brain self-medicating with whatever triggers neurochemical engagement. It is biology, not character.",
        relatable: "One viral tweet captured the ADHD dopamine problem perfectly: 'Neurotypical brain: I should do this. ADHD brain: Yes but does it ignite something in my soul or do I physically die?' The humor lands because it is neurochemically accurate.",
      },
    ],
    cta: "Dopamind is designed around dopamine science — immediate rewards, visual feedback, and gamified progress built specifically for ADHD brains.",
  },

  9: {
    id: 9,
    title: 'ADHD diagnosed in adulthood: what late diagnosis feels like',
    tag: 'Stories',
    emoji: '🌱',
    color: '#F5F3FF',
    accent: '#7C3AED',
    date: 'Jan 20, 2026',
    readTime: '8 min read',
    hook: "You are 34, or 42, or 51. You have just received an ADHD diagnosis. And your first emotion is not relief. It is grief. And that is completely valid — and far more common than anyone tells you.",
    keyInsight: "Late diagnosis frequently leads to what psychologists call 'biographical reinterpretation' — re-reading your entire life history through a new lens. Every failure, every 'could do better,' every job lost and relationship strained suddenly has context. For many people this is more painful before it becomes liberating.",
    sections: [
      {
        heading: "Why late diagnosis is so common",
        body: [
          "A 2023 systematic review in PMC specifically examined diagnostic gaps for ADHD in adult women, finding significant evidence that the disorder presents differently — more inattentive, less hyperactive, more internalized — in ways that traditional diagnostic frameworks, developed primarily through research on young boys, consistently fail to identify.",
          "The same underdiagnosis applies to many adults of color, to people from cultures where ADHD is less recognized, and to anyone who was bright enough to compensate — to mask — for long enough to avoid flagging the system as a child.",
        ],
      },
      {
        heading: "The emotional aftermath",
        body: [
          "Research from the University of Utah Health (2024) describes a flood of emotions following late diagnosis including relief, anger, grief, and identity confusion. The grief is specific: mourning the life you might have had. The careers avoided out of fear of failure. The relationships that fractured. The years spent believing you were broken.",
          "The anger is also specific. It is directed at a system that missed you for decades, at teachers who said you were not reaching your potential, at the people who told you to just try harder.",
        ],
        quote: "I have wasted so much of my life fighting myself. Now I find out I was just fighting my own brain. — late diagnosis community, shared thousands of times",
      },
      {
        heading: "How to move forward after a late diagnosis",
        body: [],
        tips: [
          "Allow the grief. A late diagnosis is a legitimate loss. Therapists who specialize in ADHD can help process the grief without bypassing it. Do not rush to the 'but at least now I know' stage.",
          "Separate the diagnosis from the narrative. ADHD explains your history. It does not define your future. The same traits that caused chaos often coexist with creativity, hyperfocus, and pattern-recognition abilities that are genuinely rare.",
          "Connect with the adult ADHD community immediately. r/ADHD, ADDitude Magazine forums, and CHADD communities offer something therapy alone cannot: immediate recognition that your experience is shared and valid.",
          "Give yourself permission to reconsider your life goals. Many late-diagnosed adults realize they made career and life choices based on shame and avoidance. The diagnosis is permission to revisit those choices from understanding rather than self-criticism.",
        ],
      },
      {
        heading: "What you deserve to know",
        body: [],
        myth: "'ADHD is a childhood disorder. Adults grow out of it.' The DSM-5 now explicitly recognizes adult-onset symptom recognition. An estimated 60-80% of children with ADHD continue to meet diagnostic criteria in adulthood. Many simply never received a childhood diagnosis.",
        relatable: "The late diagnosis experience — crying in a neuropsychologist's office not from sadness but from recognition, from decades of confusion suddenly making sense — is one of the most commonly shared experiences in adult ADHD spaces. If that was you, you are not alone. You were never broken. You were undiagnosed.",
      },
    ],
    cta: "Dopamind is built for adult ADHD brains — wherever you are in your journey. No judgment. Just tools that work. Try it free.",
  },

  10: {
    id: 10,
    title: 'How sleep affects ADHD symptoms (and what to do about it)',
    tag: 'Wellbeing',
    emoji: '🌙',
    color: '#EFF6FF',
    accent: '#3B82F6',
    date: 'Jan 14, 2026',
    readTime: '7 min read',
    hook: "If your ADHD symptoms feel noticeably worse after a bad night, you are not imagining it. And if you consistently cannot fall asleep at a normal hour no matter how tired you are, that might not be insomnia. It might be biology — specifically, your circadian clock running 90 minutes behind schedule.",
    keyInsight: "Dim-light melatonin onset (DLMO) — the biological marker of the body's sleep signal — is delayed by approximately 90 minutes in adults with ADHD compared to controls. This is not a preference. It is a physiological difference driven by the same dopaminergic dysregulation underlying ADHD itself.",
    sections: [
      {
        heading: "The ADHD-sleep relationship is deeper than you think",
        body: [
          "A landmark paper 'ADHD as a Circadian Rhythm Disorder' published in Frontiers in Psychiatry (2025) synthesized extensive evidence: sleep disturbances affect up to 80% of adults with ADHD. Delayed sleep-wake timing — the chronic inability to fall asleep until late at night — occurs in up to 78% of ADHD adults.",
          "A 2026 randomized clinical trial in SAGE Journals found that treating sleep problems directly, rather than just ADHD symptoms, led to significant improvements in ADHD symptoms, fatigue, and depressive symptoms. Sleep may itself be an ADHD treatment target.",
        ],
      },
      {
        heading: "Why poor sleep hits ADHD brains harder",
        body: [
          "Sleep deprivation increases inattention, emotional dysregulation, and impulsivity — essentially mimicking ADHD symptoms in neurotypical people. For someone who already has ADHD, poor sleep does not just make symptoms worse; it can make them clinically unmanageable.",
          "The bidirectional nature is particularly cruel: ADHD makes sleep harder to initiate and regulate, and the resulting poor sleep makes ADHD symptoms dramatically worse the next day. It is a cycle that many ADHD adults have been stuck in for decades without understanding why.",
        ],
        quote: "My body is tired but my brain is running a podcast I did not subscribe to. — most common ADHD sleep description online",
      },
      {
        heading: "Evidence-based strategies that actually help",
        body: [],
        tips: [
          "Fix your wake time first. A consistent wake time — even after a short night — anchors the circadian rhythm more effectively than a consistent bedtime. Your body re-syncs around when you wake up.",
          "Use morning bright light exposure. 20-30 minutes of bright light, ideally sunlight, within 30 minutes of waking advances the circadian clock and shifts melatonin onset earlier. This is one of the most evidence-backed chronotherapy interventions available.",
          "Eliminate blue light from 8pm onward. Blue light suppresses melatonin production and is particularly impactful on delayed-phase ADHD circadian systems. Blue light filtering glasses or screen filters are not placebo.",
          "Discuss low-dose melatonin timing with your doctor. Small doses (0.5 to 1mg) taken 90 minutes before your desired sleep time can shift the circadian clock earlier, rather than the sedating large doses most people take at bedtime.",
        ],
      },
      {
        heading: "The myth that keeps people stuck",
        body: [],
        myth: "'ADHD adults just need better sleep habits.' While sleep hygiene matters, the circadian phase delay in ADHD is neurobiological. Behavioral interventions alone are insufficient for those with clinically significant circadian dysfunction. This requires a medical conversation, not willpower.",
        relatable: "The r/ADHD experience of lying awake until 2am, exhausted but with a wired brain that refuses to stop, then being completely non-functional the next day — that is not a habit. That is a circadian clock that never got the memo about normal sleep hours.",
      },
    ],
    cta: "Better sleep starts with better daytime structure. Dopamind's focus timers help you build a consistent daily rhythm that supports sleep.",
  },

  11: {
    id: 11,
    title: 'ADHD hyperfocus: the superpower with a serious catch',
    tag: 'Focus',
    emoji: '🔥',
    color: '#ECFDF5',
    accent: '#059669',
    date: 'Jan 7, 2026',
    readTime: '6 min read',
    hook: "You sat down to 'quickly' sketch a design at 9pm. You looked up and it was 4am. You had not eaten, your phone had 11 missed calls, and you had produced your best work in months. This is hyperfocus — the paradox at the heart of ADHD.",
    keyInsight: "Hyperfocus is not controllable in the way the word 'superpower' implies. It is not a tool you can reliably direct at your most important tasks. It goes where the dopamine goes — which often means your favorite hobby, a fascinating rabbit hole, or a creative project, while the deadline sits untouched.",
    sections: [
      {
        heading: "Hyperfocus is real, validated science",
        body: [
          "A 2021 paper in PMC titled 'Hyperfocus: the forgotten frontier of attention' established hyperfocus as a legitimate cognitive phenomenon. A 2024 study in Nature Scientific Reports validated the Adult Hyperfocus Questionnaire, finding that hyperfocus scores correlated positively with ADHD traits — confirming the link between ADHD neurobiology and this extreme attentional state.",
          "A 2025 study in SAGE Journals examined hyperfocus alongside procrastination in ADHD, finding that 68% of participants reported frequent hyperfocus episodes, with 40% noting that hyperfocus regularly caused them to neglect important responsibilities. The word 'superpower' understates the complexity.",
        ],
      },
      {
        heading: "What is actually happening neurologically",
        body: [
          "Hyperfocus appears to involve the same dopamine-driven interest circuitry that governs ADHD's attention problems. When a task triggers sufficient dopamine activation — through novelty, passion, challenge, or competition — the ADHD brain does not just focus. It locks in with an intensity most neurotypical people simply cannot access.",
          "This explains why hyperfocus cannot be directed on demand. You cannot create dopamine activation for a task that does not genuinely interest you by deciding to. The chemistry has to be there.",
        ],
        quote: "The ADHD community meme: 'I can spend 9 hours researching a hobby I will abandon in three weeks but cannot write a three-email reply for three months.' That is not preference. That is dopamine.",
      },
      {
        heading: "Working with hyperfocus instead of against it",
        body: [],
        tips: [
          "Set entry and exit protocols before starting anything potentially hyperfocus-triggering. Before opening a book, game, or creative project, set a specific alarm and write what else needs to happen today. The protocol must be established before your brain locks in.",
          "Align hyperfocus with high-value work intentionally. Identify what subjects or task types reliably trigger your hyperfocus. Can you structure your career or projects to lean into those triggers?",
          "Do not rely on hyperfocus for reliability. Build systems for routine tasks that do not require hyperfocus, because it will not arrive on demand for those.",
          "Use the 'end of session' rule. Agree in advance that a specific physical cue — like an alarm in another room — means you must stop, eat, check messages, and assess what else needs attention.",
        ],
      },
      {
        heading: "The weaponized misunderstanding",
        body: [],
        myth: "'You can focus when you care enough, so you choose not to focus on other things.' Hyperfocus is involuntary and interest-driven. It proves the brain can focus under specific dopamine conditions — not that it can do so on demand. Using hyperfocus as evidence against ADHD is one of the most harmful misunderstandings of the condition.",
        relatable: "The experience of looking up from hyperfocus to realize you missed dinner, three alarms, and a message that said 'did you forget we had plans?' — that is not carelessness. That is what it looks like when a brain locks into a dopamine signal and the outside world stops being real.",
      },
    ],
    cta: "Dopamind's focus timers help you channel your focus intentionally and know when to stop. Try it free.",
  },

  12: {
    id: 12,
    title: 'Building an ADHD-friendly morning routine that actually works',
    tag: 'Productivity',
    emoji: '☀️',
    color: '#FFFBEB',
    accent: '#F59E0B',
    date: 'Jan 1, 2026',
    readTime: '6 min read',
    hook: "Every morning routine article sounds the same: wake up at 5am, meditate for 20 minutes, journal, cold shower, and you will be a changed person. If you have ADHD, you have probably tried this, maintained it for four days, and then the wheels came completely off. That is not failure. That is a system designed for a different brain.",
    keyInsight: "Mornings are when executive dysfunction is at its most severe — the prefrontal cortex is at its lowest activation before medication and movement. The solution is never more willpower. It is reducing cognitive friction to near zero by automating as many decisions as possible before the morning even begins.",
    sections: [
      {
        heading: "Why ADHD mornings are uniquely hard",
        body: [
          "The prefrontal cortex, responsible for sequencing, time estimation, and task initiation, is at its lowest activation early in the morning, especially before medication and movement. Research from PMC on strategies for ADHD confirms that externalized executive function supports, rather than internal willpower, are what actually work.",
          "A 2024 review on ADHD and circadian rhythm adds another layer: many ADHD adults have a biologically delayed circadian clock, meaning their brain is genuinely not at peak alertness until later in the morning. Fighting this biology without addressing it physiologically is a losing battle.",
        ],
      },
      {
        heading: "The decision fatigue problem",
        body: [
          "The number of decisions you make before leaving the house may matter more than the specific activities in your routine. Every decision — what to wear, what to eat, where your keys are — draws from the same limited executive function pool. Decision fatigue hits ADHD adults faster and harder than neurotypical people.",
          "The most effective ADHD morning routines are not about adding activities. They are about eliminating decisions.",
        ],
        quote: "Your evening self is neurologically more capable than your morning self. Let your evening self do the work of morning decision-making, so your morning self just has to show up and follow.",
      },
      {
        heading: "What evidence says actually works",
        body: [],
        tips: [
          "Design your morning the night before. Lay out clothes, prep breakfast ingredients, put your bag by the door, charge your devices. Your morning self is neurologically impaired compared to your evening self. Let your evening self do the work.",
          "Anchor your entire routine to one fixed 'anchor habit.' Not a five-step sequence — just one unmovable action that happens every morning at the same time. Everything else hangs off this anchor.",
          "Move your body within the first 30 minutes. It does not need to be a workout. A 10-minute walk, a short yoga sequence, or even a dance in the kitchen is enough to prime executive function chemistry. Multiple studies confirm aerobic exercise improves ADHD executive function for hours afterward.",
          "Use morning light strategically. Open blinds immediately on waking, or step outside for five minutes. Morning light exposure is one of the most powerful circadian anchors and directly reduces the delayed grogginess endemic to ADHD.",
        ],
      },
      {
        heading: "Permission to do it differently",
        body: [],
        myth: "'ADHD people just need more discipline in the mornings.' Mornings are when executive dysfunction is at its worst. More discipline is not the answer. A better-designed environment is. The goal is reducing cognitive friction to near zero, not building more willpower.",
        relatable: "The r/ADHD post 'My morning routine is: lie in bed for 45 minutes negotiating with myself, then rush through everything in 8 minutes while hating myself' has been called painfully accurate by thousands of people. If that is you, you are not broken. You are running a high-demand system on low-dopamine fuel. The fix is fuel, not willpower.",
      },
    ],
    cta: "Dopamind helps you build a sustainable daily focus system with timers, task management, and gamified rewards designed for ADHD. Start your free trial today.",
  },
}

// ── RENDER HELPERS ──────────────────────────────────────────────────────────────
function TagBadge({ tag, accent, color }: { tag: string; accent: string; color: string }) {
  return (
    <span
      className="inline-block text-xs font-semibold px-3 py-1 rounded-full"
      style={{ background: color, color: accent }}
    >
      {tag}
    </span>
  )
}

// ── PAGE ────────────────────────────────────────────────────────────────────────
export default function BlogPostPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  const article = ARTICLES[id]

  if (!article) notFound()

  const related = Object.values(ARTICLES)
    .filter(a => a.id !== id)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <header
        className="sticky top-0 z-50 px-6 h-14 flex items-center justify-between"
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #16A34A, #15803D)' }}
          >
            C
          </div>
          <span className="text-sm font-semibold text-slate-900 tracking-tight">Dopamind</span>
        </Link>
        <Link
          href="/blog"
          className="text-sm font-medium flex items-center gap-1"
          style={{ color: '#16A34A' }}
        >
          ← All articles
        </Link>
        <Link
          href="/signup"
          className="text-sm font-semibold px-4 py-2 rounded-xl text-white hidden sm:block"
          style={{ background: 'linear-gradient(135deg, #16A34A, #15803D)' }}
        >
          Try free
        </Link>
      </header>

      {/* Hero */}
      <div
        className="py-16 px-6"
        style={{
          background: `linear-gradient(180deg, ${article.color} 0%, #ffffff 100%)`,
          borderBottom: '1px solid #F1F5F9',
        }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-4">
            <TagBadge tag={article.tag} accent={article.accent} color={article.color} />
          </div>
          <div style={{ fontSize: '64px', lineHeight: 1, marginBottom: '20px' }}>{article.emoji}</div>
          <h1
            className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight mb-4"
            style={{ letterSpacing: '-0.03em' }}
          >
            {article.title}
          </h1>
          <div className="flex items-center justify-center gap-3 text-xs text-slate-400">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #16A34A, #15803D)' }}
            >
              CM
            </div>
            <span className="font-medium text-slate-600">Dopamind Team</span>
            <span>·</span>
            <span>{article.date}</span>
            <span>·</span>
            <span>{article.readTime}</span>
          </div>
        </div>
      </div>

      {/* Article body */}
      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* Hook paragraph */}
        <p className="text-lg text-slate-700 leading-relaxed mb-8 font-medium">
          {article.hook}
        </p>

        {/* Key insight callout */}
        <div
          className="rounded-2xl p-5 mb-10"
          style={{
            background: article.color,
            border: `1.5px solid`,
            borderColor: article.accent + '40',
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="text-xs font-black uppercase tracking-widest px-2 py-1 rounded-lg text-white flex-shrink-0 mt-0.5"
              style={{ background: article.accent, fontSize: '9px' }}
            >
              KEY INSIGHT
            </div>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">{article.keyInsight}</p>
          </div>
        </div>

        {/* Sections */}
        {article.sections.map((section, si) => (
          <div key={si} className="mb-10">
            <h2
              className="text-xl font-black text-slate-900 mb-4"
              style={{ letterSpacing: '-0.02em' }}
            >
              {section.heading}
            </h2>

            {section.body.map((para, pi) => (
              <p key={pi} className="text-base text-slate-600 leading-relaxed mb-4">
                {para}
              </p>
            ))}

            {section.quote && (
              <div
                className="my-6 pl-5 py-1"
                style={{ borderLeft: `3px solid ${article.accent}` }}
              >
                <p className="text-base text-slate-700 leading-relaxed italic">{section.quote}</p>
              </div>
            )}

            {section.tips && section.tips.length > 0 && (
              <div className="space-y-3 mt-4">
                {section.tips.map((tip, ti) => {
                  const [label, ...rest] = tip.split(':')
                  const hasLabel = rest.length > 0 && label.length < 60
                  return (
                    <div
                      key={ti}
                      className="flex gap-3 p-4 rounded-xl"
                      style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}
                    >
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
                        style={{ background: article.accent, minWidth: '20px' }}
                      >
                        {ti + 1}
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {hasLabel ? (
                          <>
                            <span className="font-semibold text-slate-800">{label}:</span>
                            {rest.join(':')}
                          </>
                        ) : tip}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}

            {section.myth && (
              <div
                className="mt-5 p-4 rounded-xl"
                style={{ background: '#FFF7ED', border: '1px solid #FED7AA' }}
              >
                <p className="text-xs font-black uppercase tracking-widest text-orange-600 mb-2" style={{ fontSize: '9px' }}>
                  MYTH TO BUST
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">{section.myth}</p>
              </div>
            )}

            {section.relatable && (
              <div
                className="mt-4 p-4 rounded-xl"
                style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}
              >
                <p className="text-xs font-black uppercase tracking-widest text-green-700 mb-2" style={{ fontSize: '9px' }}>
                  FROM THE COMMUNITY
                </p>
                <p className="text-sm text-slate-600 leading-relaxed italic">{section.relatable}</p>
              </div>
            )}
          </div>
        ))}

        {/* Divider */}
        <div className="border-t border-slate-100 my-10" />

        {/* CTA card */}
        {article.cta && (
          <div
            className="rounded-3xl p-8 text-center mb-12"
            style={{
              background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)',
              border: '1px solid #BBF7D0',
            }}
          >
            <div className="text-3xl mb-3">🌳</div>
            <h3
              className="text-lg font-black text-slate-900 mb-2"
              style={{ letterSpacing: '-0.02em' }}
            >
              Ready to work with your ADHD brain?
            </h3>
            <p className="text-sm text-slate-500 mb-5 max-w-sm mx-auto">{article.cta}</p>
            <Link
              href="/signup"
              className="inline-block px-6 py-3 rounded-xl text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #16A34A, #15803D)' }}
            >
              Start free — no credit card needed
            </Link>
          </div>
        )}

        {/* Related articles */}
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Related articles</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {related.map(r => (
              <Link
                key={r.id}
                href={`/blog/${r.id}`}
                className="block p-4 rounded-2xl"
                style={{
                  background: r.color,
                  border: `1px solid ${r.accent}20`,
                  transition: 'transform 150ms ease',
                }}
              >
                <div className="text-2xl mb-2">{r.emoji}</div>
                <div
                  className="text-xs font-semibold mb-1"
                  style={{ color: r.accent }}
                >
                  {r.tag}
                </div>
                <p
                  className="text-xs font-bold text-slate-800 leading-snug line-clamp-2"
                  style={{ letterSpacing: '-0.01em' }}
                >
                  {r.title}
                </p>
                <p className="text-xs text-slate-400 mt-2">{r.readTime}</p>
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer
        className="px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8"
        style={{ borderTop: '1px solid #F1F5F9' }}
      >
        <p className="text-xs text-slate-400">© 2026 Dopamind. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/blog" className="text-xs text-slate-400 hover:text-slate-600" style={{ transition: 'color 150ms' }}>All articles</Link>
          <Link href="/pricing" className="text-xs text-slate-400 hover:text-slate-600" style={{ transition: 'color 150ms' }}>Pricing</Link>
          <Link href="/signup" className="text-xs font-semibold" style={{ color: '#16A34A' }}>Try free</Link>
        </div>
      </footer>

    </div>
  )
}

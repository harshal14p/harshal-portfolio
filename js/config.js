/* ==========================================================================
   SITE CONFIG
   This is the ONE file you should need to touch for day-to-day updates:
   your name, contact links, asset paths, and the project list.
   Everything here gets injected into the page automatically by main.js.
   ========================================================================== */

export const SITE = {
  name: "Harshal Chouhan",
  nameShort: "HC",

  email: "harshal@example.com",           // shown as "Email Me" / footer link
  linkedin: "https://linkedin.com",        // full LinkedIn profile URL
  instagram: "https://instagram.com",      // full Instagram profile URL

  resumePath: "assets/resume.pdf",         // put your resume file at this path
  profileImagePath: "assets/profile.jpg",  // put your photo at this path
  bikeModelPath: "assets/bike.glb",        // put your 3D model at this path
};

/* --------------------------------------------------------------------------
   PROJECTS
   Add, remove, or edit entries freely — the "Selected Work" grid on the
   page is generated entirely from this array. Categories used for the
   filter pills are derived automatically from whatever you put in
   "category" below, so you can rename/add categories any time.

   Fields:
     title        – project name
     category     – e.g. "Video", "Campaign", "Creative", "AI / Visual", "Social Content"
     image        – path under assets/projects/ (leave as-is to show a
                     placeholder tile until you add a real image)
     description  – one or two sentence summary
     role         – your role on the project
     contribution – what you specifically contributed
     tools        – tools/process used, shown as a small meta line
     link         – optional external URL ("" to hide the link)
     video        – optional path/URL to an mp4 ("" if none)
   -------------------------------------------------------------------------- */

export const PROJECTS = [
  {
    title: "Add project title",
    category: "Video",
    image: "assets/projects/project-01.jpg",
    description: "Project description — replace with a short summary of what this project was and the outcome.",
    role: "My role",
    contribution: "My contribution",
    tools: "Tools / process",
    link: "",
    video: "",
  },
  {
    title: "Add project title",
    category: "Campaign",
    image: "assets/projects/project-02.jpg",
    description: "Project description — replace with a short summary of what this project was and the outcome.",
    role: "My role",
    contribution: "My contribution",
    tools: "Tools / process",
    link: "",
    video: "",
  },
  {
    title: "Add project title",
    category: "Creative",
    image: "assets/projects/project-03.jpg",
    description: "Project description — replace with a short summary of what this project was and the outcome.",
    role: "My role",
    contribution: "My contribution",
    tools: "Tools / process",
    link: "",
    video: "",
  },
  {
    title: "Add project title",
    category: "AI / Visual",
    image: "assets/projects/project-04.jpg",
    description: "Project description — replace with a short summary of what this project was and the outcome.",
    role: "My role",
    contribution: "My contribution",
    tools: "Tools / process",
    link: "",
    video: "",
  },
  {
    title: "Add project title",
    category: "Social Content",
    image: "assets/projects/project-05.jpg",
    description: "Project description — replace with a short summary of what this project was and the outcome.",
    role: "My role",
    contribution: "My contribution",
    tools: "Tools / process",
    link: "",
    video: "",
  },
];

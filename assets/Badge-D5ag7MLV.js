import{p as e}from"./Button-3z7z_Wpi.js";var t=e(),n={beginner:`bg-success/15 text-success border-success/20`,intermediate:`bg-accent-secondary/15 text-accent-secondary border-accent-secondary/20`,advanced:`bg-accent-primary/15 text-accent-primary border-accent-primary/20`,elite:`bg-accent-primary/15 text-accent-primary border-accent-primary/20`,default:`bg-white/10 text-text-secondary border-white/10`};function r({children:e,variant:r=`default`,className:i=``}){return(0,t.jsx)(`span`,{className:`
        inline-flex items-center
        rounded-full border px-2.5 py-0.5
        text-xs font-medium leading-5
        ${n[r]||n.default}
        ${i}
      `,children:e})}export{r as t};
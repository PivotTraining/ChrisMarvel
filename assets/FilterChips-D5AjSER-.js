import{p as e}from"./Button-3z7z_Wpi.js";var t=e();function n({options:e=[],selected:n,onChange:r}){return(0,t.jsx)(`div`,{className:`flex overflow-x-auto gap-2 no-scrollbar pb-1`,children:e.map(e=>(0,t.jsx)(`button`,{type:`button`,onClick:()=>r?.(e.value),className:`
              flex-shrink-0 rounded-full px-4 py-1.5
              text-sm font-medium
              transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50
              cursor-pointer
              ${n===e.value?`bg-accent-primary text-white shadow-lg shadow-accent-primary/20`:`bg-transparent border border-border-subtle text-text-secondary hover:border-border-active hover:text-text-primary`}
            `,children:e.label},e.value))})}export{n as t};
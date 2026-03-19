import{p as e}from"./Button-3z7z_Wpi.js";var t=e();function n({children:e,className:n=``}){return(0,t.jsx)(`main`,{className:`min-h-screen px-4 pt-4 pb-24 mt-14 max-w-lg mx-auto ${n}`,children:e})}var r={sm:`p-3`,md:`p-4`,lg:`p-6`};function i({children:e,className:n=``,glass:i=!1,padding:a=`md`,onClick:o}){return(0,t.jsx)(`div`,{onClick:o,role:o?`button`:void 0,tabIndex:o?0:void 0,onKeyDown:o?e=>{(e.key===`Enter`||e.key===` `)&&o(e)}:void 0,className:`
        rounded-xl
        transition-colors duration-200
        hover:bg-bg-surface-hover
        ${i?`backdrop-blur-xl bg-white/5 border border-white/10`:`bg-bg-surface border border-border-subtle`}
        ${r[a]||r.md}
        ${o?`cursor-pointer`:``}
        ${n}
      `,children:e})}export{n,i as t};
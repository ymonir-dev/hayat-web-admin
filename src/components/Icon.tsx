import type { ReactNode } from 'react';
export default function Icon({name,size=20}:{name:string;size?:number}){
  const p={width:size,height:size,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.8,strokeLinecap:'round' as const,strokeLinejoin:'round' as const,'aria-hidden':true};
  const map:Record<string,ReactNode>={
    dashboard:<svg {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    building:<svg {...p}><path d="M4 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17"/><path d="M16 9h3a1 1 0 0 1 1 1v11M8 7h4M8 11h4M8 15h4M2 21h20"/></svg>,
    branches:<svg {...p}><path d="M6 3v18M18 7v14M6 7h12M10 11h4M10 15h4M10 19h4"/></svg>,
    users:<svg {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    team:<svg {...p}><circle cx="8" cy="8" r="3"/><circle cx="17" cy="7" r="2.5"/><path d="M2 21v-2a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v2M14 15a4.5 4.5 0 0 1 8 3v3"/></svg>,
    doctor:<svg {...p}><circle cx="12" cy="6" r="3"/><path d="M5 21v-2a7 7 0 0 1 14 0v2M12 13v5M9.5 15.5h5"/></svg>,
    calendar:<svg {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>,
    services:<svg {...p}><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"/><path d="M12 7v10M7 12h10"/></svg>,
    requests:<svg {...p}><path d="M6 2h9l4 4v16H6z"/><path d="M14 2v5h5M9 12h6M9 16h6"/></svg>,
    bell:<svg {...p}><path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg>,
    hr:<svg {...p}><path d="M4 4h16v16H4z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>,
    audit:<svg {...p}><path d="M9 3h6l1 2h3v16H5V5h3z"/><path d="m9 13 2 2 4-4"/></svg>,
    shield:<svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>,
    health:<svg {...p}><path d="M12 21s-7-4.35-9-8.5C1 8 4 5 7.5 5A5 5 0 0 1 12 7.5 5 5 0 0 1 16.5 5C20 5 23 8 21 12.5 19 16.65 12 21 12 21Z"/><path d="M8 12h2l1-2 2 4 1-2h2"/></svg>,
    search:<svg {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>,
    logout:<svg {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
    menu:<svg {...p}><path d="M4 6h16M4 12h16M4 18h16"/></svg>,
    close:<svg {...p}><path d="m6 6 12 12M18 6 6 18"/></svg>,
    arrow:<svg {...p}><path d="m9 18 6-6-6-6"/></svg>,
    money:<svg {...p}><circle cx="12" cy="12" r="9"/><path d="M16 8.5c-.8-1-2-1.5-4-1.5-2.2 0-3.5 1.1-3.5 2.7 0 4.3 7.5 1.7 7.5 5.7 0 1.6-1.4 2.6-3.7 2.6-2 0-3.5-.6-4.4-1.8M12 5v14"/></svg>,
    patients:<svg {...p}><circle cx="8" cy="8" r="3"/><path d="M2 21v-2a6 6 0 0 1 12 0v2"/><path d="M17 11v6M14 14h6"/></svg>,
    departments:<svg {...p}><path d="M3 21h18M5 21V7l7-4 7 4v14"/><path d="M8 10h2M14 10h2M8 14h2M14 14h2M11 21v-4h2v4"/></svg>,
    inventory:<svg {...p}><path d="M4 7l8-4 8 4-8 4-8-4Z"/><path d="M4 7v10l8 4 8-4V7M12 11v10"/></svg>,
    reports:<svg {...p}><path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/></svg>,
    communication:<svg {...p}><path d="M21 15a4 4 0 0 1-4 4H8l-5 3v-7a6 6 0 0 1-1-3c0-4 4-7 9-7s9 3 9 7a6 6 0 0 1-1 3"/></svg>,
    settings:<svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.09A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.2 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H2.4v-4h.09A1.7 1.7 0 0 0 4 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 8.4 4.2a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V2.4h4v.09A1.7 1.7 0 0 0 15 4a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 8.4a1.7 1.7 0 0 0 .6 1 1.7 1.7 0 0 0 1.1.4h.09v4h-.09A1.7 1.7 0 0 0 19.4 15Z"/></svg>,
  };
  return map[name]??map.dashboard;
}

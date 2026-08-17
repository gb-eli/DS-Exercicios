-- APPLIED/LIVE — 10 pilot reward rules for LAB Virtual.
-- Client cannot claim these generically; lab-virtual-core validates the completion first.
do $$ declare p uuid; begin
select id into p from public.platforms where code='lab-virtual';
delete from public.reward_rules where platform_id=p and event_type='activity.completed' and metadata->>'pilot'='true';
insert into public.reward_rules(platform_id,activity_id,event_type,trust_level,xp,points,coins,repeatable,active,metadata) values
(p,'completion:solar:rocket-launch','activity.completed','rule_validated',110,0,58,false,true,'{"source":"lab-virtual-core","client_claimable":false,"pilot":true,"validation":"lab_virtual_allowlist_tool_open_min_time"}'::jsonb),
(p,'completion:printing3d:successful-print-v40','activity.completed','rule_validated',110,0,62,false,true,'{"source":"lab-virtual-core","client_claimable":false,"pilot":true,"validation":"lab_virtual_allowlist_tool_open_min_time"}'::jsonb),
(p,'completion:productivity:sheet-formulas','activity.completed','rule_validated',80,0,35,false,true,'{"source":"lab-virtual-core","client_claimable":false,"pilot":true,"validation":"lab_virtual_allowlist_tool_open_min_time"}'::jsonb),
(p,'completion:traffic:signal-safe','activity.completed','rule_validated',70,0,25,false,true,'{"source":"lab-virtual-core","client_claimable":false,"pilot":true,"validation":"lab_virtual_allowlist_tool_open_min_time"}'::jsonb),
(p,'completion:thermal-panel:limits','activity.completed','rule_validated',70,0,30,false,true,'{"source":"lab-virtual-core","client_claimable":false,"pilot":true,"validation":"lab_virtual_allowlist_tool_open_min_time"}'::jsonb),
(p,'completion:biomonitor:comparison','activity.completed','rule_validated',65,0,25,false,true,'{"source":"lab-virtual-core","client_claimable":false,"pilot":true,"validation":"lab_virtual_allowlist_tool_open_min_time"}'::jsonb),
(p,'completion:iptv:stable','activity.completed','rule_validated',60,0,25,false,true,'{"source":"lab-virtual-core","client_claimable":false,"pilot":true,"validation":"lab_virtual_allowlist_tool_open_min_time"}'::jsonb),
(p,'completion:audio:classification:440','activity.completed','rule_validated',25,0,10,false,true,'{"source":"lab-virtual-core","client_claimable":false,"pilot":true,"validation":"lab_virtual_allowlist_tool_open_min_time"}'::jsonb),
(p,'completion:vm:installed:windows11','activity.completed','rule_validated',120,0,45,false,true,'{"source":"lab-virtual-core","client_claimable":false,"pilot":true,"validation":"lab_virtual_allowlist_tool_open_min_time"}'::jsonb),
(p,'completion:voxelcraft:challenge:mission','activity.completed','rule_validated',80,0,18,false,true,'{"source":"lab-virtual-core","client_claimable":false,"pilot":true,"validation":"lab_virtual_allowlist_tool_open_min_time"}'::jsonb);
end $$;

import{n as e}from"./chunk-DnJy8xQt.js";import{t}from"./iframe-_ElaqRNb.js";import{n,t as r}from"./CartesianChart-dC5r-cRz.js";import{n as i,t as a}from"./Line-Bm8FBY0c.js";import{n as o,t as s}from"./common-CLAOgDL7.js";function c({categoricalX:e=!0,showPoints:t,series:n,y:i,...s}){let c=o(n,i).map(e=>({...e,showPoints:e.showPoints??t}));return(0,l.jsx)(r,{...s,series:c,xScaleType:e?`point`:`linear`,renderSeries:e=>e.series.map(e=>(0,l.jsx)(a,{series:e,animate:s.animate},e.seriesIndex))})}var l,u=e((()=>{n(),i(),s(),l=t(),c.__docgenInfo={description:"Multi-series line chart. Pass `data` + `x` + either `y` (single series) or\n`series` (multiple). Everything else is optional and themeable.",methods:[],displayName:`LineChart`,props:{data:{required:!0,tsType:{name:`Array`,elements:[{name:`Record`,elements:[{name:`string`},{name:`unknown`}],raw:`Record<string, unknown>`}],raw:`Datum[]`},description:``},x:{required:!0,tsType:{name:`union`,raw:`string | ((d: Datum, index: number) => T)`,elements:[{name:`string`},{name:`unknown`}]},description:`x accessor (category key for bar/line/area, numeric key for scatter).`},series:{required:!1,tsType:{name:`Array`,elements:[{name:`SeriesConfig`}],raw:`SeriesConfig[]`},description:"Multiple series. Mutually exclusive with the `y` shorthand."},y:{required:!1,tsType:{name:`union`,raw:`string | ((d: Datum, index: number) => T)`,elements:[{name:`string`},{name:`unknown`}]},description:`Single-series shorthand.`},width:{required:!1,tsType:{name:`union`,raw:`number | 'auto'`,elements:[{name:`number`},{name:`literal`,value:`'auto'`}]},description:`Pixel width, or 'auto' (default) to fill the parent and re-flow on resize.`},height:{required:!1,tsType:{name:`union`,raw:`number | 'auto'`,elements:[{name:`number`},{name:`literal`,value:`'auto'`}]},description:"Pixel height, or 'auto' to derive from width via `aspect`. Default 300."},aspect:{required:!1,tsType:{name:`number`},description:`width / height ratio used when height is 'auto'. Default 2.`},margin:{required:!1,tsType:{name:`Partial`,elements:[{name:`Margin`}],raw:`Partial<Margin>`},description:``},theme:{required:!1,tsType:{name:`signature`,type:`object`,raw:`{
  // Keep arrays (e.g. the colors palette) intact rather than widening their
  // elements to \`T | undefined\`; only plain objects get a shallow Partial.
  [P in keyof T]?: T[P] extends readonly unknown[]
    ? T[P]
    : T[P] extends object
      ? Partial<T[P]>
      : T[P];
}`,signature:{properties:[{key:{name:`ChartTheme`,required:!1},value:{name:`unknown`}}]}},description:``},showGrid:{required:!1,tsType:{name:`boolean`},description:``},showXAxis:{required:!1,tsType:{name:`boolean`},description:``},showYAxis:{required:!1,tsType:{name:`boolean`},description:``},showTooltip:{required:!1,tsType:{name:`boolean`},description:``},showLegend:{required:!1,tsType:{name:`boolean`},description:``},xTickCount:{required:!1,tsType:{name:`number`},description:``},yTickCount:{required:!1,tsType:{name:`number`},description:``},formatX:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(value: unknown, index: number) => string`,signature:{arguments:[{type:{name:`unknown`},name:`value`},{type:{name:`number`},name:`index`}],return:{name:`string`}}},description:``},formatY:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(value: number) => string`,signature:{arguments:[{type:{name:`number`},name:`value`}],return:{name:`string`}}},description:``},yDomain:{required:!1,tsType:{name:`tuple`,raw:`[number, number]`,elements:[{name:`number`},{name:`number`}]},description:``},animate:{required:!1,tsType:{name:`boolean`},description:`Disable enter animation regardless of theme.`},categoricalX:{required:!1,tsType:{name:`boolean`},description:`Use a point scale (true, default) or a numeric linear x scale.`,defaultValue:{value:`true`,computed:!1}},showPoints:{required:!1,tsType:{name:`boolean`},description:`Render dots at every point across all series.`}}}})),d,f,p,m,h,g;e((()=>{u(),d={title:`Charts/LineChart`,component:c,tags:[`autodocs`],args:{data:[{month:`Jan`,sales:42,profit:18},{month:`Feb`,sales:55,profit:22},{month:`Mar`,sales:49,profit:20},{month:`Apr`,sales:73,profit:31},{month:`May`,sales:68,profit:28},{month:`Jun`,sales:91,profit:40}],x:`month`,height:280}},f={args:{y:`sales`,showPoints:!0}},p={args:{series:[{dataKey:`sales`},{dataKey:`profit`}],showPoints:!0}},m={args:{series:[{dataKey:`sales`,curve:`step`}]}},h={args:{series:[{dataKey:`sales`},{dataKey:`profit`}],theme:{colors:[`#ff6b6b`,`#4ecdc4`],grid:{dashArray:`4 4`}}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    y: 'sales',
    showPoints: true
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    series: [{
      dataKey: 'sales'
    }, {
      dataKey: 'profit'
    }],
    showPoints: true
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    series: [{
      dataKey: 'sales',
      curve: 'step'
    }]
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    series: [{
      dataKey: 'sales'
    }, {
      dataKey: 'profit'
    }],
    theme: {
      colors: ['#ff6b6b', '#4ecdc4'],
      grid: {
        dashArray: '4 4'
      }
    }
  }
}`,...h.parameters?.docs?.source}}},g=[`SingleSeries`,`MultiSeries`,`Stepped`,`Themed`]}))();export{p as MultiSeries,f as SingleSeries,m as Stepped,h as Themed,g as __namedExportsOrder,d as default};
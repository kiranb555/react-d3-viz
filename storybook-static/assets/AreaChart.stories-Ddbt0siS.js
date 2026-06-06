import{n as e}from"./chunk-DnJy8xQt.js";import{t}from"./iframe-CISgnNV3.js";import{n,t as r}from"./CartesianChart-BM9zuDDx.js";import{n as i,t as a}from"./Line-D9Mj8E2H.js";import{n as o,t as s}from"./common-rqCLdXh_.js";function c({categoricalX:e=!0,showPoints:t,series:n,y:i,...s}){let c=o(n,i).map(e=>({...e,fillOpacity:e.fillOpacity??.25,showPoints:e.showPoints??t}));return(0,l.jsx)(r,{...s,series:c,xScaleType:e?`point`:`linear`,renderSeries:e=>e.series.map(e=>(0,l.jsx)(a,{series:e,area:!0,animate:s.animate},e.seriesIndex))})}var l,u=e((()=>{n(),i(),s(),l=t(),c.__docgenInfo={description:"Area chart — a line chart with the region beneath each series filled. Shares\nthe line series renderer with `area` enabled.",methods:[],displayName:`AreaChart`,props:{data:{required:!0,tsType:{name:`Array`,elements:[{name:`Record`,elements:[{name:`string`},{name:`unknown`}],raw:`Record<string, unknown>`}],raw:`Datum[]`},description:``},x:{required:!0,tsType:{name:`union`,raw:`string | ((d: Datum, index: number) => T)`,elements:[{name:`string`},{name:`unknown`}]},description:`x accessor (category key for bar/line/area, numeric key for scatter).`},series:{required:!1,tsType:{name:`Array`,elements:[{name:`SeriesConfig`}],raw:`SeriesConfig[]`},description:"Multiple series. Mutually exclusive with the `y` shorthand."},y:{required:!1,tsType:{name:`union`,raw:`string | ((d: Datum, index: number) => T)`,elements:[{name:`string`},{name:`unknown`}]},description:`Single-series shorthand.`},width:{required:!1,tsType:{name:`union`,raw:`number | 'auto'`,elements:[{name:`number`},{name:`literal`,value:`'auto'`}]},description:`Pixel width, or 'auto' (default) to fill the parent and re-flow on resize.`},height:{required:!1,tsType:{name:`union`,raw:`number | 'auto'`,elements:[{name:`number`},{name:`literal`,value:`'auto'`}]},description:"Pixel height, or 'auto' to derive from width via `aspect`. Default 300."},aspect:{required:!1,tsType:{name:`number`},description:`width / height ratio used when height is 'auto'. Default 2.`},margin:{required:!1,tsType:{name:`Partial`,elements:[{name:`Margin`}],raw:`Partial<Margin>`},description:``},theme:{required:!1,tsType:{name:`signature`,type:`object`,raw:`{
  // Keep arrays (e.g. the colors palette) intact rather than widening their
  // elements to \`T | undefined\`; only plain objects get a shallow Partial.
  [P in keyof T]?: T[P] extends readonly unknown[]
    ? T[P]
    : T[P] extends object
      ? Partial<T[P]>
      : T[P];
}`,signature:{properties:[{key:{name:`ChartTheme`,required:!1},value:{name:`unknown`}}]}},description:``},showGrid:{required:!1,tsType:{name:`boolean`},description:``},showXAxis:{required:!1,tsType:{name:`boolean`},description:``},showYAxis:{required:!1,tsType:{name:`boolean`},description:``},showTooltip:{required:!1,tsType:{name:`boolean`},description:``},showLegend:{required:!1,tsType:{name:`boolean`},description:``},xTickCount:{required:!1,tsType:{name:`number`},description:``},yTickCount:{required:!1,tsType:{name:`number`},description:``},formatX:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(value: unknown, index: number) => string`,signature:{arguments:[{type:{name:`unknown`},name:`value`},{type:{name:`number`},name:`index`}],return:{name:`string`}}},description:``},formatY:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(value: number) => string`,signature:{arguments:[{type:{name:`number`},name:`value`}],return:{name:`string`}}},description:``},yDomain:{required:!1,tsType:{name:`tuple`,raw:`[number, number]`,elements:[{name:`number`},{name:`number`}]},description:``},animate:{required:!1,tsType:{name:`boolean`},description:`Disable enter animation regardless of theme.`},categoricalX:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`true`,computed:!1}},showPoints:{required:!1,tsType:{name:`boolean`},description:``}}}})),d,f,p,m,h,g,_,v,y;e((()=>{u(),d={title:`Charts/AreaChart`,component:c,tags:[`autodocs`],parameters:{layout:`centered`},args:{data:[{month:`Jan`,sales:42,profit:18,revenue:120},{month:`Feb`,sales:55,profit:22,revenue:150},{month:`Mar`,sales:49,profit:20,revenue:140},{month:`Apr`,sales:73,profit:31,revenue:200},{month:`May`,sales:68,profit:28,revenue:180},{month:`Jun`,sales:91,profit:40,revenue:250}],x:`month`,width:600,height:300},argTypes:{width:{control:{type:`range`,min:300,max:800,step:50}},height:{control:{type:`range`,min:200,max:500,step:50}},showPoints:{control:`boolean`},showGrid:{control:`boolean`},showLegend:{control:`boolean`},stacked:{control:`boolean`},animate:{control:`boolean`}}},f={args:{y:`sales`,showGrid:!0,showLegend:!1}},p={args:{series:[{dataKey:`sales`},{dataKey:`profit`}],stacked:!0,showGrid:!0,showLegend:!0}},m={args:{series:[{dataKey:`sales`},{dataKey:`profit`}],stacked:!1,showGrid:!0,showPoints:!0,showLegend:!0}},h={args:{series:[{dataKey:`sales`,curve:`monotone`},{dataKey:`profit`,curve:`monotone`}],stacked:!0,showLegend:!0}},g={args:{series:[{dataKey:`sales`,curve:`step`},{dataKey:`profit`,curve:`step`}],stacked:!0,showLegend:!0}},_={args:{series:[{dataKey:`sales`},{dataKey:`profit`},{dataKey:`revenue`}],stacked:!0,showLegend:!0,theme:{colors:[`#ff6b6b`,`#4ecdc4`,`#45b7d1`]}}},v={args:{series:[{dataKey:`sales`},{dataKey:`profit`}],stacked:!0,showGrid:!1,animate:!1,showLegend:!0}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    y: 'sales',
    showGrid: true,
    showLegend: false
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    series: [{
      dataKey: 'sales'
    }, {
      dataKey: 'profit'
    }],
    stacked: true,
    showGrid: true,
    showLegend: true
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    series: [{
      dataKey: 'sales'
    }, {
      dataKey: 'profit'
    }],
    stacked: false,
    showGrid: true,
    showPoints: true,
    showLegend: true
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    series: [{
      dataKey: 'sales',
      curve: 'monotone'
    }, {
      dataKey: 'profit',
      curve: 'monotone'
    }],
    stacked: true,
    showLegend: true
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    series: [{
      dataKey: 'sales',
      curve: 'step'
    }, {
      dataKey: 'profit',
      curve: 'step'
    }],
    stacked: true,
    showLegend: true
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    series: [{
      dataKey: 'sales'
    }, {
      dataKey: 'profit'
    }, {
      dataKey: 'revenue'
    }],
    stacked: true,
    showLegend: true,
    theme: {
      colors: ['#ff6b6b', '#4ecdc4', '#45b7d1']
    }
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    series: [{
      dataKey: 'sales'
    }, {
      dataKey: 'profit'
    }],
    stacked: true,
    showGrid: false,
    animate: false,
    showLegend: true
  }
}`,...v.parameters?.docs?.source}}},y=[`SingleSeries`,`MultiSeriesStacked`,`MultiSeriesOverlaid`,`SmoothCurve`,`StepCurve`,`ThemedColors`,`NoAnimationNoGrid`]}))();export{m as MultiSeriesOverlaid,p as MultiSeriesStacked,v as NoAnimationNoGrid,f as SingleSeries,h as SmoothCurve,g as StepCurve,_ as ThemedColors,y as __namedExportsOrder,d as default};
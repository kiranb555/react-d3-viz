import{n as e}from"./chunk-DnJy8xQt.js";import{t}from"./iframe-CISgnNV3.js";import{n,t as r}from"./CartesianChart-BM9zuDDx.js";import{n as i,t as a}from"./common-rqCLdXh_.js";import{n as o,t as s}from"./Bar-Waw9sF31.js";function c({categoryGap:e,groupGap:t,radius:n,stacked:a,series:o,y:c,...u}){let d=i(o,c);return(0,l.jsx)(r,{...u,series:d,xScaleType:`band`,bandPadding:e,stacked:a,renderSeries:()=>(0,l.jsx)(s,{animate:u.animate,groupGap:t,radius:n})})}var l,u=e((()=>{n(),o(),a(),l=t(),c.__docgenInfo={description:"Vertical bar chart. One series renders simple bars; multiple series render\ngrouped (side-by-side) bars, or stacked bars when `stacked` is set.",methods:[],displayName:`BarChart`,props:{data:{required:!0,tsType:{name:`Array`,elements:[{name:`Record`,elements:[{name:`string`},{name:`unknown`}],raw:`Record<string, unknown>`}],raw:`Datum[]`},description:``},x:{required:!0,tsType:{name:`union`,raw:`string | ((d: Datum, index: number) => T)`,elements:[{name:`string`},{name:`unknown`}]},description:`x accessor (category key for bar/line/area, numeric key for scatter).`},series:{required:!1,tsType:{name:`Array`,elements:[{name:`SeriesConfig`}],raw:`SeriesConfig[]`},description:"Multiple series. Mutually exclusive with the `y` shorthand."},y:{required:!1,tsType:{name:`union`,raw:`string | ((d: Datum, index: number) => T)`,elements:[{name:`string`},{name:`unknown`}]},description:`Single-series shorthand.`},width:{required:!1,tsType:{name:`union`,raw:`number | 'auto'`,elements:[{name:`number`},{name:`literal`,value:`'auto'`}]},description:`Pixel width, or 'auto' (default) to fill the parent and re-flow on resize.`},height:{required:!1,tsType:{name:`union`,raw:`number | 'auto'`,elements:[{name:`number`},{name:`literal`,value:`'auto'`}]},description:"Pixel height, or 'auto' to derive from width via `aspect`. Default 300."},aspect:{required:!1,tsType:{name:`number`},description:`width / height ratio used when height is 'auto'. Default 2.`},margin:{required:!1,tsType:{name:`Partial`,elements:[{name:`Margin`}],raw:`Partial<Margin>`},description:``},theme:{required:!1,tsType:{name:`signature`,type:`object`,raw:`{
  // Keep arrays (e.g. the colors palette) intact rather than widening their
  // elements to \`T | undefined\`; only plain objects get a shallow Partial.
  [P in keyof T]?: T[P] extends readonly unknown[]
    ? T[P]
    : T[P] extends object
      ? Partial<T[P]>
      : T[P];
}`,signature:{properties:[{key:{name:`ChartTheme`,required:!1},value:{name:`unknown`}}]}},description:``},showGrid:{required:!1,tsType:{name:`boolean`},description:``},showXAxis:{required:!1,tsType:{name:`boolean`},description:``},showYAxis:{required:!1,tsType:{name:`boolean`},description:``},showTooltip:{required:!1,tsType:{name:`boolean`},description:``},showLegend:{required:!1,tsType:{name:`boolean`},description:``},xTickCount:{required:!1,tsType:{name:`number`},description:``},yTickCount:{required:!1,tsType:{name:`number`},description:``},formatX:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(value: unknown, index: number) => string`,signature:{arguments:[{type:{name:`unknown`},name:`value`},{type:{name:`number`},name:`index`}],return:{name:`string`}}},description:``},formatY:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(value: number) => string`,signature:{arguments:[{type:{name:`number`},name:`value`}],return:{name:`string`}}},description:``},yDomain:{required:!1,tsType:{name:`tuple`,raw:`[number, number]`,elements:[{name:`number`},{name:`number`}]},description:``},animate:{required:!1,tsType:{name:`boolean`},description:`Disable enter animation regardless of theme.`},categoryGap:{required:!1,tsType:{name:`number`},description:`Gap between adjacent categories (band inner padding), 0..1.`},groupGap:{required:!1,tsType:{name:`number`},description:`Gap between grouped sub-bars within a category, 0..1.`},radius:{required:!1,tsType:{name:`number`},description:`Bar corner radius.`},stacked:{required:!1,tsType:{name:`boolean`},description:`Stack series on top of each other instead of grouping side-by-side.`}}}})),d,f,p,m,h,g,_,v;e((()=>{u(),d={title:`Charts/BarChart`,component:c,tags:[`autodocs`],parameters:{layout:`centered`},args:{data:[{month:`Jan`,sales:42,profit:18,revenue:120},{month:`Feb`,sales:55,profit:22,revenue:150},{month:`Mar`,sales:49,profit:20,revenue:140},{month:`Apr`,sales:73,profit:31,revenue:200},{month:`May`,sales:68,profit:28,revenue:180},{month:`Jun`,sales:91,profit:40,revenue:250}],x:`month`,width:600,height:300},argTypes:{width:{control:{type:`range`,min:300,max:800,step:50}},height:{control:{type:`range`,min:200,max:500,step:50}},stacked:{control:`boolean`},showGrid:{control:`boolean`},showLegend:{control:`boolean`},animate:{control:`boolean`}}},f={args:{y:`sales`,showGrid:!0,showLegend:!1}},p={args:{series:[{dataKey:`sales`},{dataKey:`profit`}],stacked:!1,showGrid:!0,showLegend:!0}},m={args:{series:[{dataKey:`sales`},{dataKey:`profit`}],stacked:!0,showGrid:!0,showLegend:!0}},h={args:{series:[{dataKey:`sales`},{dataKey:`profit`}],stacked:!1,showGrid:!0,showLegend:!0,theme:{colors:[`#ff6b6b`,`#4ecdc4`]}}},g={args:{series:[{dataKey:`sales`},{dataKey:`profit`},{dataKey:`revenue`}],stacked:!0,showLegend:!0,theme:{colors:[`#ff6b6b`,`#4ecdc4`,`#45b7d1`]}}},_={args:{series:[{dataKey:`sales`},{dataKey:`profit`}],stacked:!0,showGrid:!1,animate:!1,showLegend:!0}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
    stacked: false,
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
    stacked: true,
    showGrid: true,
    showLegend: true
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    series: [{
      dataKey: 'sales'
    }, {
      dataKey: 'profit'
    }],
    stacked: false,
    showGrid: true,
    showLegend: true,
    theme: {
      colors: ['#ff6b6b', '#4ecdc4']
    }
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}},v=[`SingleSeries`,`GroupedBars`,`StackedBars`,`CustomTheme`,`ThemedColors`,`NoAnimationNoGrid`]}))();export{h as CustomTheme,p as GroupedBars,_ as NoAnimationNoGrid,f as SingleSeries,m as StackedBars,g as ThemedColors,v as __namedExportsOrder,d as default};
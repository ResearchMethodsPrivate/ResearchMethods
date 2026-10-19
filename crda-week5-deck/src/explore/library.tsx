/**
 * OpenUI component library for the optional "Explore CRDA" panel (key E).
 * These are real OpenUI components (defineComponent + Zod schemas) rendered
 * by OpenUI's <Renderer>. No model is called: the OpenUI Lang program they
 * render is an authored, static fixture (crda.oui.ts) validated by tests.
 */
import { useState } from 'react';
import { createLibrary, defineComponent } from '@openuidev/react-lang';
import { z } from 'zod/v4';
import katex from 'katex';

const Tex = ({ src }: { src: string }) => (
  <span className="ox-tex" dangerouslySetInnerHTML={{ __html: katex.renderToString(src, { throwOnError: false }) }} />
);

export const StageCard = defineComponent({
  name: 'StageCard',
  description: 'One stage of the CRDA pipeline with its equation and paper source',
  props: z.object({
    step: z.number(),
    title: z.string(),
    equation: z.string().describe('KaTeX source'),
    body: z.string(),
    source: z.string(),
  }),
  component: ({ props }) => (
    <article className="ox-stage" data-openui="StageCard">
      <p className="ox-stage-k">{props.step}</p>
      <h3>{props.title}</h3>
      <p className="ox-eq"><Tex src={props.equation} /></p>
      <p>{props.body}</p>
      <p className="ox-src">{props.source}</p>
    </article>
  ),
});

const Dag = ({ holds }: { holds: boolean }) => (
  <svg viewBox="0 0 360 260" className="ox-dag" role="img"
    aria-label={holds ? 'Assumption holds: X_P affects Y but not Z' : 'Assumption violated: hidden U drives X_P and Y'}>
    <defs>
      <marker id="ox-arr" viewBox="0 0 10 10" refX="10" refY="5" markerUnits="userSpaceOnUse" markerWidth="14" markerHeight="14" orient="auto">
        <path d="M0 0 L10 5 L0 10 z" fill="currentColor" />
      </marker>
    </defs>
    <g className="ox-edges">
      <line x1="96" y1="62" x2="252" y2="118" markerEnd="url(#ox-arr)" />
      <line x1="96" y1="198" x2="252" y2="142" markerEnd="url(#ox-arr)" />
      <line x1="290" y1="70" x2="290" y2="100" markerEnd="url(#ox-arr)" />
      {holds
        ? <line className="ox-ok" x1="100" y1="44" x2="256" y2="40" strokeDasharray="2 9" />
        : <>
          <line className="ox-bad" x1="176" y1="214" x2="104" y2="204" markerEnd="url(#ox-arr)" />
          <line className="ox-bad" x1="196" y1="214" x2="262" y2="150" markerEnd="url(#ox-arr)" />
          <line className="ox-bad ox-dep" x1="98" y1="186" x2="270" y2="64" />
        </>}
    </g>
    {[['X_R', 70, 50], ['X_P', 70, 200], ['Y', 290, 130], ['Z', 290, 44], ...(holds ? [] : [['U', 186, 236]])].map(([l, x, y]) => (
      <g key={l as string} className={`ox-node ${l === 'U' ? 'ox-u' : l === 'Z' ? 'ox-z' : ''}`}>
        <circle cx={x as number} cy={y as number} r="24" />
        <text x={x as number} y={(y as number) + 8} textAnchor="middle">
          {(l as string)[0]}{(l as string)[2] && <tspan baselineShift="sub" fontSize="13">{(l as string)[2]}</tspan>}
        </text>
      </g>
    ))}
  </svg>
);

export const AssumptionToggle = defineComponent({
  name: 'AssumptionToggle',
  description: 'Toggle between a causal structure satisfying and violating residual invariance',
  props: z.object({ holds: z.string(), breaks: z.string(), note: z.string() }),
  component: ({ props }) => {
    const [holds, setHolds] = useState(true);
    return (
      <div className="ox-assume" data-openui="AssumptionToggle">
        <div className="ox-switch" role="radiogroup" aria-label="Assumption 3.1">
          <button role="radio" aria-checked={holds} onClick={() => setHolds(true)}>✓ Satisfied</button>
          <button role="radio" aria-checked={!holds} onClick={() => setHolds(false)}>✗ Violated</button>
        </div>
        <Dag holds={holds} />
        <p className={holds ? 'ox-ok-text' : 'ox-bad-text'} data-state={holds ? 'holds' : 'breaks'}>{holds ? props.holds : props.breaks}</p>
        <p className="ox-illus">Illustrative — adapted from Mohebbi et al. (2026), Fig. 1</p>
        <p className="ox-note">{props.note}</p>
      </div>
    );
  },
});

export const Claim = defineComponent({
  name: 'Claim',
  description: 'A number reported by the original authors, with its source in the paper',
  props: z.object({ label: z.string(), value: z.string(), source: z.string() }),
  component: ({ props }) => (
    <li className="ox-claim"><span className="ox-claim-v">{props.value}</span><span>{props.label}</span><span className="ox-src">{props.source}</span></li>
  ),
});

export const ClaimsVsPlan = defineComponent({
  name: 'ClaimsVsPlan',
  description: 'Original authors’ reported results beside our proposed (not yet run) reproduction',
  props: z.object({ claims: z.array(Claim.ref), plan: z.array(z.string()), status: z.string() }),
  component: ({ props, renderNode }) => (
    <div className="ox-cvp" data-openui="ClaimsVsPlan">
      <section>
        <h3>Original authors’ reported results</h3>
        <p className="ox-warn">Not our group’s reproduced results</p>
        <ul>{renderNode(props.claims)}</ul>
      </section>
      <section>
        <h3>Our proposed reproduction</h3>
        <p className="ox-warn">{props.status}</p>
        <ol>{props.plan.map((p) => <li key={p}>{p}</li>)}</ol>
      </section>
    </div>
  ),
});

export const Tab = defineComponent({
  name: 'Tab',
  description: 'A labelled tab of the explorer',
  props: z.object({ label: z.string(), items: z.array(z.union([StageCard.ref, AssumptionToggle.ref, ClaimsVsPlan.ref])) }),
  component: ({ props, renderNode }) => <div className="ox-tab-body">{renderNode(props.items)}</div>,
});

export const Explorer = defineComponent({
  name: 'Explorer',
  description: 'Root: a titled set of tabs',
  props: z.object({ title: z.string(), tabs: z.array(Tab.ref) }),
  component: ({ props, renderNode }) => {
    const [active, setActive] = useState(0);
    const tabs = props.tabs as unknown as { props: { label: string } }[];
    return (
      <div className="ox-root" data-openui="Explorer">
        <h2 id="ox-title">{props.title}</h2>
        <div className="ox-tabs" role="tablist">
          {tabs.map((t, i) => (
            <button key={t.props.label} role="tab" aria-selected={i === active} onClick={() => setActive(i)}>{t.props.label}</button>
          ))}
        </div>
        <div role="tabpanel">{renderNode(props.tabs[active])}</div>
      </div>
    );
  },
});

export const library = createLibrary({
  components: [Explorer, Tab, StageCard, AssumptionToggle, Claim, ClaimsVsPlan],
  root: 'Explorer',
});

import { Heading } from "./Heading";
import { Body } from "./Body";
import { BulletList } from "./BulletList";
import { NumberedSteps } from "./NumberedSteps";
import { ComparisonTable } from "./ComparisonTable";
import { TwoColumn } from "./TwoColumn";
import { StatCallout } from "./StatCallout";
import { QuoteBlock } from "./QuoteBlock";
import { IconCard } from "./IconCard";
import { CardGrid } from "./CardGrid";
import { CodeBlock } from "./CodeBlock";
import { ChartBlock } from "./ChartBlock";
import { ImageBlock } from "./ImageBlock";
import { TagList } from "./TagList";
import { Spacer } from "./Spacer";
import { Divider } from "./Divider";
import { CTABox } from "./CTABox";
import { ShowcaseCard } from "./ShowcaseCard";
import { HeroIcon } from "./HeroIcon";
import { PromptBlock } from "./PromptBlock";
import { MetricRow } from "./MetricRow";

import type { ComponentType } from "@/lib/types";

export const componentRegistry: Record<ComponentType, React.ComponentType<any>> = {
  Heading, Body, BulletList, NumberedSteps, ComparisonTable,
  TwoColumn, StatCallout, QuoteBlock, IconCard, CardGrid,
  CodeBlock, ChartBlock, ImageBlock, TagList, Spacer,
  Divider, CTABox, ShowcaseCard, HeroIcon, PromptBlock,
  MetricRow,
};

export {
  Heading, Body, BulletList, NumberedSteps, ComparisonTable,
  TwoColumn, StatCallout, QuoteBlock, IconCard, CardGrid,
  CodeBlock, ChartBlock, ImageBlock, TagList, Spacer,
  Divider, CTABox, ShowcaseCard, HeroIcon, PromptBlock,
  MetricRow,
};

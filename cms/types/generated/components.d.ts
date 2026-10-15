import type { Schema, Struct } from '@strapi/strapi';

export interface AboutStatsAboutStats extends Struct.ComponentSchema {
  collectionName: 'components_about_stats_about_stats';
  info: {
    displayName: 'About Stats';
  };
  attributes: {
    bike: Schema.Attribute.Text;
    japanese: Schema.Attribute.Text;
    links: Schema.Attribute.Component<'link.link', true>;
    stack: Schema.Attribute.Text;
  };
}

export interface AboutAboutBlock extends Struct.ComponentSchema {
  collectionName: 'components_about_about_blocks';
  info: {
    displayName: 'About Block';
  };
  attributes: {
    body: Schema.Attribute.RichText;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    imageCaption: Schema.Attribute.String;
    quote: Schema.Attribute.String;
    title: Schema.Attribute.String;
    titleAlt: Schema.Attribute.String;
  };
}

export interface GalleryGallery extends Struct.ComponentSchema {
  collectionName: 'components_gallery_galleries';
  info: {
    displayName: 'Gallery';
    icon: 'landscape';
  };
  attributes: {
    alt: Schema.Attribute.String;
    caption: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface LinkLink extends Struct.ComponentSchema {
  collectionName: 'components_link_links';
  info: {
    displayName: 'link';
    icon: 'link';
  };
  attributes: {
    href: Schema.Attribute.String;
    text: Schema.Attribute.String;
  };
}

export interface SectionsAboutBlocks extends Struct.ComponentSchema {
  collectionName: 'components_sections_about_blocks';
  info: {
    displayName: 'About Blocks';
  };
  attributes: {
    aboutBlocks: Schema.Attribute.Component<'about.about-block', true>;
    aboutStats: Schema.Attribute.Component<'about-stats.about-stats', false>;
  };
}

export interface SectionsAboutHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_about_heroes';
  info: {
    displayName: 'About Hero';
  };
  attributes: {
    body: Schema.Attribute.RichText;
    cvFile: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    imageCaption: Schema.Attribute.String;
    label: Schema.Attribute.String;
    link: Schema.Attribute.Component<'link.link', false>;
    title: Schema.Attribute.String;
    titleAlt: Schema.Attribute.String;
  };
}

export interface SectionsExploreCta extends Struct.ComponentSchema {
  collectionName: 'components_sections_explore_ctas';
  info: {
    displayName: 'Explore CTA';
    icon: 'globe';
  };
  attributes: {
    heading: Schema.Attribute.String;
  };
}

export interface SectionsFeaturedStages extends Struct.ComponentSchema {
  collectionName: 'components_sections_featured_stages';
  info: {
    displayName: 'Featured Stages';
  };
  attributes: {
    heading: Schema.Attribute.String;
  };
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_heroes';
  info: {
    displayName: 'hero';
    icon: 'dashboard';
  };
  attributes: {
    heading: Schema.Attribute.String;
    introduction: Schema.Attribute.Text;
    subheading: Schema.Attribute.String;
  };
}

export interface SeoSeo extends Struct.ComponentSchema {
  collectionName: 'components_seo_seos';
  info: {
    displayName: 'seo';
    icon: 'oneToMany';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text;
    metaTitle: Schema.Attribute.String;
    ogImage: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface StatsStats extends Struct.ComponentSchema {
  collectionName: 'components_stats_stats';
  info: {
    displayName: 'stats';
    icon: 'layout';
  };
  attributes: {
    distanceKm: Schema.Attribute.Decimal;
    elevationGainM: Schema.Attribute.Integer;
    elevationLossM: Schema.Attribute.Integer;
    movingTimeMin: Schema.Attribute.Integer;
    sleptAt: Schema.Attribute.Enumeration<
      ['wild-camp', 'campsite', 'hotel', 'guesthouse', 'ryokan', 'friend']
    >;
    tempC: Schema.Attribute.Integer;
    weather: Schema.Attribute.Enumeration<
      ['sunny', 'cloudy', 'rain', 'snow', 'wind']
    >;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'about-stats.about-stats': AboutStatsAboutStats;
      'about.about-block': AboutAboutBlock;
      'gallery.gallery': GalleryGallery;
      'link.link': LinkLink;
      'sections.about-blocks': SectionsAboutBlocks;
      'sections.about-hero': SectionsAboutHero;
      'sections.explore-cta': SectionsExploreCta;
      'sections.featured-stages': SectionsFeaturedStages;
      'sections.hero': SectionsHero;
      'seo.seo': SeoSeo;
      'stats.stats': StatsStats;
    }
  }
}

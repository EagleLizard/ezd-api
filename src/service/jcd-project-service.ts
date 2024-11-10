
import { JcdProjectDb } from './db/jcd-project-db';
import { JcdCreditsDb } from './db/jcd-credits-db';
import { JcdPressDb } from './db/jcd-press-db';

type JcdCredit = {
  label: string;
  contribs: string[];
};

type JcdPressLink = {
  label: string;
  uri: string;
};

type JcdPressItem = {
  publication: string;
  description?: string;
  link: JcdPressLink;
};

type JcdProject = {
  projectKey: string;
  route: string;
  title: string;
  playwright: string[];
  venue: string;
  producer: string;
  month: number;
  year: number;
  description: string[];
  productionCredits: string[];
  mediaAndPress: JcdPressItem[];
};

type JcdProjectListItem = {} & {
  projectKey: string;
  route: string;
  title: string;
  titleUri: string;
  orderIndex: number;
};

export const JcdProjectService = {
  getProjectByRoute,
  getProjects,
} as const;

async function getProjects(): Promise<JcdProjectListItem[]> {
  let jcdProjectListItems: JcdProjectListItem[];
  let jcdProjectListItemDtos = await JcdProjectDb.getProjects();
  jcdProjectListItems = [];
  for(let i = 0; i < jcdProjectListItemDtos.length; ++i) {
    let jcdProjectListItem: JcdProjectListItem;
    let jcdProjectDto = jcdProjectListItemDtos[i];
    jcdProjectListItem = {
      projectKey: jcdProjectDto.project_key,
      route: jcdProjectDto.route,
      title: jcdProjectDto.title,
      titleUri: jcdProjectDto.title_uri ?? '',
      orderIndex: jcdProjectDto.sort_order,
    };
    jcdProjectListItems.push(jcdProjectListItem);
  }
  return jcdProjectListItems;
}

async function getProjectByRoute(projectRoute: string) {
  let jcdProjectDto = await JcdProjectDb.getProjectBaseByRoute(projectRoute);
  // let jcdProducerDtos = await JcdCreditsDb.getProducers(jcdProjectDto.jcd_project_id);
  // let jcdCredits = await getCredits(jcdProjectDto.jcd_project_id);
  // let jcdProdCredits = await getProdCredits(jcdProjectDto.jcd_project_id);
  // let jcdPressItems = await getPress(jcdProjectDto.jcd_project_id);
  let [
    jcdProducerDtos,
    jcdCredits,
    jcdProdCredits,
    jcdPressItems,
  ] = await Promise.all([
    JcdCreditsDb.getProducers(jcdProjectDto.jcd_project_id),
    getCredits(jcdProjectDto.jcd_project_id),
    getProdCredits(jcdProjectDto.jcd_project_id),
    getPress(jcdProjectDto.jcd_project_id),
  ]);

  let jcdProject: JcdProject;
  const playwright = jcdCredits.map(jcdCredit => {
    return `${jcdCredit.label} ${jcdCredit.contribs.join(' & ')}`;
  });
  const producer = jcdProducerDtos.map(jcdProducerDto => {
    return jcdProducerDto.name;
  }).join(' & ');
  const productionCredits = jcdProdCredits.map(jcdCredit => {
    return `${jcdCredit.label} ${jcdCredit.contribs.join(' & ')}`;
  });

  if(jcdProjectDto.venue === null) {
    /*
      todo:xxx: replace with proper error logging
    _*/
    console.error(jcdProjectDto);
    throw new Error('unexpected null JcdProject venue');
  }
  if(jcdProjectDto.description_text === null) {
    /*
      todo:xxx: replace with proper error logging
    _*/
    console.error(jcdProjectDto);
    throw new Error('unexpected null JcdProject description_text');
  }

  jcdProject = {
    projectKey: jcdProjectDto.project_key,
    route: jcdProjectDto.route,
    title: jcdProjectDto.title,
    playwright,
    venue: jcdProjectDto.venue,
    producer,
    month: jcdProjectDto.project_date.getMonth() + 1,
    year: jcdProjectDto.project_date.getFullYear(),
    description: jcdProjectDto.description_text?.split('\n'),
    productionCredits,
    mediaAndPress: jcdPressItems,
  };
  return jcdProject;
}

async function getProdCredits(jcd_project_id: number) {
  let jcdProdCredits: JcdCredit[];
  let jcdProdCreditDtos = await JcdCreditsDb.getProdCredits(jcd_project_id);
  let jcdProdCreditMap: Map<number, JcdCredit> = new Map();

  for(let i = 0; i < jcdProdCreditDtos.length; ++i) {
    let currCredit: JcdCredit | undefined;
    let currCreditDto = jcdProdCreditDtos[i];
    if((currCredit = jcdProdCreditMap.get(currCreditDto.jcd_prod_credit_id)) === undefined) {
      currCredit = {
        label: currCreditDto.label,
        contribs: [],
      };
      jcdProdCreditMap.set(currCreditDto.jcd_prod_credit_id, currCredit);
    }
    currCredit.contribs.push(currCreditDto.name);
  }
  jcdProdCredits = [ ...jcdProdCreditMap.values() ];
  return jcdProdCredits;
}

async function getCredits(jcd_project_id: number) {
  let jcdCredits: JcdCredit[];
  let jcdCreditDtos = await JcdCreditsDb.getCredits(jcd_project_id);
  let jcdCreditMap: Map<number, JcdCredit> = new Map();

  for(let i = 0; i < jcdCreditDtos.length; ++i) {
    let currCredit: JcdCredit | undefined;
    let currCreditDto = jcdCreditDtos[i];
    if((currCredit = jcdCreditMap.get(currCreditDto.jcd_credit_id)) === undefined) {
      currCredit = {
        label: currCreditDto.label,
        contribs: [],
      };
      jcdCreditMap.set(currCreditDto.jcd_credit_id, currCredit);
    }
    currCredit.contribs.push(currCreditDto.name);
  }
  jcdCredits = [ ...jcdCreditMap.values() ];
  return jcdCredits;
}

async function getPress(jcd_project_id: number): Promise<JcdPressItem[]> {
  let pressItems: JcdPressItem[];
  let jcdPressDtos = await JcdPressDb.getProjectPress(jcd_project_id);
  pressItems = [];
  for(let i = 0; i < jcdPressDtos.length; ++i) {
    let jcdPressDto = jcdPressDtos[i];
    let pressItem: JcdPressItem = {
      publication: jcdPressDto.publication_name,
      link: {
        label: jcdPressDto.link_text,
        uri: jcdPressDto.link_url,
      },
    };
    if(jcdPressDto.description !== null) {
      pressItem.description = jcdPressDto.description;
    }
    pressItems.push(pressItem);
  }
  return pressItems;
}

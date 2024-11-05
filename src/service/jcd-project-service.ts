
import { JcdProjectDb } from './db/jcd-project-db';
import { JcdCreditsDb } from './db/jcd-credits-db';
import { JcdProjectDtoType } from '../lib/models/dto/jcd-project-dto';
import { JcdPressDb } from './db/jcd-press-db';

type JcdCredit = {
  label: string;
  contribs: string[];
};

type JcdPressLink = {
  label: string;
  url: string;
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
  getProject,
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
      titleUri: jcdProjectDto.title_uri,
      orderIndex: jcdProjectDto.sort_order,
    };
    jcdProjectListItems.push(jcdProjectListItem);
  }
  return jcdProjectListItems;
}

async function getProject(jcdProjectDto: JcdProjectDtoType) {
  // let jcdProjectDescDto = await JcdProjectDb.getDesc(jcdProjectDto.jcd_project_id);
  // let jcdProjectVenueDto = await JcdProjectDb.getVenue(jcdProjectDto.jcd_project_id);
  // let jcdProducerDtos = await JcdCreditsDb.getProducers(jcdProjectDto.jcd_project_id);
  // let jcdCredits = await getCredits(jcdProjectDto.jcd_project_id);
  // let jcdProdCredits = await getProdCredits(jcdProjectDto.jcd_project_id);
  // let jcdPressItems = await getPress(jcdProjectDto.jcd_project_id);
  let [
    jcdProjectDescDto,
    jcdProjectVenueDto,
    jcdProducerDtos,
    jcdCredits,
    jcdProdCredits,
    jcdPressItems,
  ] = await Promise.all([
    JcdProjectDb.getDesc(jcdProjectDto.jcd_project_id),
    JcdProjectDb.getVenue(jcdProjectDto.jcd_project_id),
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
  jcdProject = {
    projectKey: jcdProjectDto.project_key,
    route: jcdProjectDto.route,
    title: jcdProjectDto.title,
    playwright,
    venue: jcdProjectVenueDto.name,
    producer,
    month: jcdProjectDto.project_date.getMonth() + 1,
    year: jcdProjectDto.project_date.getFullYear(),
    description: jcdProjectDescDto.text.split('\n'),
    productionCredits,
    mediaAndPress: jcdPressItems,
  };
  return jcdProject;
}

async function getProdCredits(jcd_project_id: number) {
  let jcdProdCreditDtos = await JcdCreditsDb.getProdCredits(jcd_project_id);
  let jcdCreditPromises: Promise<JcdCredit>[] = [];
  for(let i = 0; i < jcdProdCreditDtos.length; ++i) {
    let currCreditDto = jcdProdCreditDtos[i];
    let contribDtosPromise: Promise<JcdCredit> = JcdCreditsDb
      .getProdCreditContribs(currCreditDto.jcd_prod_credit_id)
      .then(prodCreditContribDtos => {
        return {
          label: currCreditDto.label,
          contribs: prodCreditContribDtos.map(contribDto => contribDto.name),
        };
      });
    jcdCreditPromises.push(contribDtosPromise);
  }
  let jcdCredits = await Promise.all(jcdCreditPromises);
  return jcdCredits;
}

async function getCredits(jcd_project_id: number) {
  let jcdCreditDtos = await JcdCreditsDb.getCredits(jcd_project_id);
  let jcdCreditPromises: Promise<JcdCredit>[] = [];
  for(let i = 0; i < jcdCreditDtos.length; ++i) {
    let currCreditDto = jcdCreditDtos[i];
    let contribDtosPromise: Promise<JcdCredit> = JcdCreditsDb
      .getCreditContribs(currCreditDto.jcd_credit_id)
      .then(contribDtos => {
        return {
          label: currCreditDto.label,
          contribs: contribDtos.map(contribDto => contribDto.name),
        };
      });
    jcdCreditPromises.push(contribDtosPromise);
  }
  let jcdCredits = await Promise.all(jcdCreditPromises);
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
        url: jcdPressDto.link_url,
      },
    };
    if(jcdPressDto.description !== null) {
      pressItem.description = jcdPressDto.description;
    }
    pressItems.push(pressItem);
  }
  return pressItems;
}

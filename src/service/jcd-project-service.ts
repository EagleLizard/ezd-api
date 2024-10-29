
import { JcdProjectDb } from './db/jcd-project-db';
import { JcdCreditsDb } from './db/jcd-credits-db';
import { JcdProjectDtoType } from '../lib/models/dto/jcd-project-dto';

type JcdCredit = {
  label: string;
  contribs: string[];
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
};

export const JcdProjectService = {
  getProject,
} as const;

async function getProject(jcdProjectDto: JcdProjectDtoType) {
  // let jcdProjectDescDto = await JcdProjectDb.getDesc(jcdProjectDto.jcd_project_id);
  // let jcdProducerDtos = await JcdCreditsDb.getProducers(jcdProjectDto.jcd_project_id);
  // let jcdCredits = await getCredits(jcdProjectDto.jcd_project_id);
  // let jcdProdCredits = await getProdCredits(jcdProjectDto.jcd_project_id);
  let [
    jcdProjectDescDto,
    jcdProjectVenueDto,
    jcdProducerDtos,
    jcdCredits,
    jcdProdCredits,
  ] = await Promise.all([
    JcdProjectDb.getDesc(jcdProjectDto.jcd_project_id),
    JcdProjectDb.getVenue(jcdProjectDto.jcd_project_id),
    JcdCreditsDb.getProducers(jcdProjectDto.jcd_project_id),
    getCredits(jcdProjectDto.jcd_project_id),
    getProdCredits(jcdProjectDto.jcd_project_id),
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

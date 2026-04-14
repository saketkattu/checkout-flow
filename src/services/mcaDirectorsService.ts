import { mockDelay } from './mockDelay';
import type { ApiResult, Director } from './types';

const DIRECTORS_DB: Record<string, Director[]> = {
  L22210MH1995PLC084781: [
    { name: 'NATARAJAN CHANDRASEKARAN', din: '00121863', designation: 'Chairman', appointedDate: '2017-02-21' },
    { name: 'RAJESH GOPINATHAN', din: '06365813', designation: 'Chief Executive Officer & Managing Director', appointedDate: '2017-02-21' },
    { name: 'PADMANABHAN GANAPATHISUBRAMANIAM', din: '02696891', designation: 'Chief Operating Officer & Executive Director', appointedDate: '2019-05-17' },
  ],
  L17110MH1973PLC019786: [
    { name: 'MUKESH DHIRUBHAI AMBANI', din: '00001695', designation: 'Chairman & Managing Director', appointedDate: '1977-06-18' },
    { name: 'HITAL RASIKLAL MESWANI', din: '00001623', designation: 'Executive Director', appointedDate: '1995-07-04' },
    { name: 'NIKHIL RASIKLAL MESWANI', din: '00001620', designation: 'Executive Director', appointedDate: '1986-11-01' },
  ],
  L85110KA1981PLC013115: [
    { name: 'NANDAN MANOHAR NILEKANI', din: '00041245', designation: 'Non-Executive Independent Director', appointedDate: '2017-08-24' },
    { name: 'SALIL PAREKH', din: '01876159', designation: 'Chief Executive Officer & Managing Director', appointedDate: '2018-01-02' },
    { name: 'U B PRAVIN RAO', din: '06782450', designation: 'Chief Operating Officer & Executive Director', appointedDate: '2014-10-10' },
  ],
  U72900KA2020PTC134567: [
    { name: 'ARJUN KRISHNASWAMY', din: '09123456', designation: 'Director', appointedDate: '2020-03-15' },
    { name: 'PRIYA VENKATARAMAN', din: '09234567', designation: 'Director', appointedDate: '2020-03-15' },
  ],
};

export async function getDirectorsByCin(cin: string): Promise<ApiResult<Director[]>> {
  await mockDelay();
  const directors = DIRECTORS_DB[cin.toUpperCase().trim()];
  if (!directors) {
    return {
      success: false,
      error: { code: 'NOT_FOUND', message: `No directors found for CIN ${cin}.` },
    };
  }
  return {
    success: true,
    response: {
      data: directors,
      source: 'MCA',
      fetchedAt: new Date().toISOString(),
    },
  };
}

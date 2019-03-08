export interface Approvaltemplate {
  _id: string;
  step: number;
  distinction: String;
  usertype: String;
  userisapprovalstage: String;
  tosaveonprofilesnextstep: number;
  activesteptext: String;
  completedsteptext: String;
  dialogbuttontext: String;
}

export class ApprovaltemplateObj implements Approvaltemplate {
  _id: string;
  step: number;
  distinction: String;
  usertype: String;
  userisapprovalstage: String;
  tosaveonprofilesnextstep: number;
  activesteptext: String;
  completedsteptext: String;
  dialogbuttontext: String;

  constructor(item?: Approvaltemplate) {
      if (item !== undefined) {
          // tslint:disable-next-line:forin
          for (const key in item) {
              try { this[key] = item[key]; } catch (e) { }
          }
      }
  }
}

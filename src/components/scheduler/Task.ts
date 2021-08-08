import { CronJob } from 'cron';

export default class Task {
  id: string
  name: string
  message: string
  isEnabled: boolean
  task: CronJob
  schedule: any
}

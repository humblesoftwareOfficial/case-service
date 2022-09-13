/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import * as moment from 'moment';

@ValidatorConstraint({ name: 'IsValidDate', async: false })
export class IsValidDate implements ValidatorConstraintInterface {
  validate(value: string) {
    if (typeof value === 'string') {
      return (
        /^(0?[1-9]|[12][0-9]|3[01])[\/](0?[1-9]|1[012])[\/\-]\d{4}$/.test(
          value,
        ) && moment(value, 'DD/MM/YYYY').isValid()
      );
    }
    return false;
  }

  defaultMessage({ property }) {
    return `${property} must be a valid date (Required format: DD/MM/YYYY)`;
  }
}

@ValidatorConstraint({ name: 'ConvertStringToDate', async: false })
export class ConvertStringToDate implements ValidatorConstraintInterface {
  validate(dateF: string, args: ValidationArguments) {
    args.object[args.constraints[0]] = 'test';
    return true;
    /* return dateHelper.isValidIntervall(
      args.object[args.constraints[0]],
      endDate,
    ); */
  }

  defaultMessage(args: ValidationArguments) {
    return 'Incorrect date.';
  }
}
/**The date string must be in DD/MM/YYYY Format */
export const stringToDate = (date: string) => {
  const dateParts = date.split('/');
  return new Date(`${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`);
};

export const getDatesBetween = (from: Date, to: Date) => {
  const dates: Date[] = [];
  let currentDate = from;
  const addDays = function (days: number) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };
  currentDate = addDays.call(currentDate, 1); //Exclude from date
  while (currentDate < to) {
    dates.push(currentDate);
    currentDate = addDays.call(currentDate, 1);
  }
  return dates;
};

// Returns the ISO week of the date.
export const getWeekNumber = (d: Date) => {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = +new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((+d - yearStart) / 86400000 + 1) / 7);
};

export const addMonthsToDate = (date: Date, monthToAdd: number) =>
  new Date(date.setMonth(date.getMonth() + monthToAdd));

export const formatDateToString = (date: Date) => {
  try {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  } catch (error) {
    return null;
  }
};

export const formatDateIntervallforMonthlyPayout = (
  month: number,
  year: number,
) => {
  let monthBefore = 0;
  let yearBefore = year;
  switch (month) {
    case 1:
      monthBefore = 12;
      yearBefore = year - 1;
      break;
    default:
      monthBefore = month - 1;
      break;
  }
  const from = stringToDate(`26/${monthBefore}/${yearBefore}`);
  const to = stringToDate(`25/${month}/${year}`);
  return {
    from: {
      value: from,
      month: monthBefore,
      year: yearBefore,
    },
    to: {
      value: to,
      month,
      year,
    },
  };
};

export const isDateBetween = (
  startDate: Date,
  endDate: Date,
  dateToVerify: Date,
) => {
  return dateToVerify >= startDate && endDate >= dateToVerify;
};

export const convertStringToDate = (date?: string) => {
  const dateParts = date.split('/');
  return new Date(`${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`);
};

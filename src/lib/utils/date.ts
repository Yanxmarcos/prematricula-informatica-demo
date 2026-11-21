// src/lib/utils/date.ts
import { format, parseISO, isValid } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import { es } from 'date-fns/locale';

const TIMEZONE = 'America/Lima';

export function formatDatePeru(date: Date | string | null | undefined, pattern: string = 'dd/MM/yyyy'): string {
    if (!date) return '';

    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';

    const zonedDate = toZonedTime(dateObj, TIMEZONE);
    return format(zonedDate, pattern, { locale: es });
}

export function formatDateTimePeru(
    date: Date | string | null | undefined
): string {
    if (!date) return "";

    const dateObj = typeof date === "string" ? parseISO(date) : date;
    if (!isValid(dateObj)) return "";

    const zonedDate = toZonedTime(dateObj, TIMEZONE);
    return format(zonedDate, "dd/MM/yyyy HH:mm:ss", { locale: es });
}

export function formatDateInputPeru(date: Date | string | null | undefined): string {
    if (!date) return '';

    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';

    const zonedDate = toZonedTime(dateObj, TIMEZONE);
    return format(zonedDate, 'yyyy-MM-dd');
}

export function toUTCFromPeru(dateString: string): Date {
    if (!dateString) return new Date();

    // Asegurar que es string
    const str = String(dateString);
    const [year, month, day] = str.split('-').map(Number);
    const peruDate = new Date(year, month - 1, day, 0, 0, 0);
    return fromZonedTime(peruDate, TIMEZONE);
}

export function getNowPeru(): Date {
    const now = new Date();
    return toZonedTime(now, TIMEZONE);
}

export function isValidDate(date: any): boolean {
    if (!date) return false;
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj);
}
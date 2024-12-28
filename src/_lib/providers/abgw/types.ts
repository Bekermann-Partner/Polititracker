interface ApiMetaResponse {
    abgeordnetenwatch_api: {
        version: string;
        changelog: string;
        licence: string;
        licence_link: string;
        documentation: string;
    };
    status: string;
    status_message: string;
    result: {
        count: number;
        total: number;
        range_start: number;
        range_end: number;
    };
}

export interface MandateResponse {
    meta: ApiMetaResponse;
    data: MandateData[];
}

export interface MandateData {
    id: number;
    entity_type: string;
    label: string;
    api_url: string;
    id_external_administration: string;
    id_external_administration_description: string;
    type: string;
    parliament_period: ParliamentPeriod;
    politician: Politician;
    start_date: string | null;
    end_date: string | null;
    info: string | null;
    electoral_data: ElectoralData;
    fraction_membership: FractionMembership[];
}

interface ParliamentPeriod {
    id: number;
    entity_type: string;
    label: string;
    api_url: string;
    abgeordnetenwatch_url: string;
}

interface Politician {
    id: number;
    entity_type: string;
    label: string;
    api_url: string;
    abgeordnetenwatch_url: string;
}

interface ElectoralData {
    id: number;
    entity_type: string;
    label: string;
    electoral_list: string | null;
    list_position: string | null;
    constituency: Constituency;
    constituency_result: number;
    constituency_result_count: number | null;
    mandate_won: string;
}

interface Constituency {
    id: number;
    entity_type: string;
    label: string;
    api_url: string;
}

interface FractionMembership {
    id: number;
    entity_type: string;
    label: string;
    fraction: Fraction;
    valid_from: string | null;
    valid_until: string | null;
}

interface Fraction {
    id: number;
    entity_type: string;
    label: string;
    api_url: string;
}

export interface SidejobResponse {
    meta: ApiMetaResponse;
    data: SidejobData[];
}

export interface SidejobData {
    id: number;
    entity_type: string;
    label: string;
    api_url: string;
    job_title_extra: string | null;
    mandates: Mandate[];
    category: string;
    income_level: string | null;
    income: number | null;
    interval: string | null;
    data_change_date: string | null;
    sidejob_organization: Organization;
    additional_information: string | null;
    created: number;
    field_city: Location | null;
    field_country: Location | null;
    field_topics: Topic[] | null;
    income_total: number | null;
}

interface Mandate {
    id: number;
    entity_type: string;
    label: string;
    api_url: string;
}

interface Organization {
    id: number;
    entity_type: string;
    label: string;
    api_url: string;
}

interface Location {
    id: number;
    entity_type: string;
    label: string;
    api_url: string;
}

interface Topic {
    id: number;
    entity_type: string;
    label: string;
    api_url: string;
    abgeordnetenwatch_url: string;
}
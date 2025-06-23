export interface IJobRepository {
    findAll(): Promise<any[]>;
}
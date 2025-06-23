import { Injectable } from "@nestjs/common";
import { IJobRepository } from "./job.repository.interface";


export class JobRepository implements IJobRepository {
    async findAll(): Promise<any[]> {
        return [];
    }
}
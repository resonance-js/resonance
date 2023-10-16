import { NgModule } from '@resonance/core';
import { BreedsModule } from './breeds/breeds.module';
import { DogModule } from './dogs/dogs.module';
import { AuthModule } from './auth/auth.module';

@NgModule({
    baseURL: 'api',
    imports: [BreedsModule, DogModule, AuthModule],
})
export class AppModule {}

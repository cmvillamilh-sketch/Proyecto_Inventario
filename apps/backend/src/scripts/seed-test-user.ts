import 'reflect-metadata';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { Role } from '../auth/enums/role.enum';

async function seedTestUser() {
  const [, , username = 'admin', password = 'Admin123!', role = Role.ADMIN] = process.argv as [
    string,
    string,
    string?,
    string?,
    Role?,
  ];

  if (!Object.values(Role).includes(role)) {
    console.error(`Rol invalido "${role}". Valores permitidos: ${Object.values(Role).join(', ')}`);
    process.exit(1);
  }

  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/mante_stock',
    entities: [User],
    synchronize: true,
  });

  await dataSource.initialize();

  const userRepository = dataSource.getRepository(User);

  const existing = await userRepository.findOne({ where: { username } });
  if (existing) {
    console.log(`El usuario "${username}" ya existe (id: ${existing.id}). No se creo ninguno nuevo.`);
    await dataSource.destroy();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = userRepository.create({
    username,
    passwordHash,
    role,
  });

  const saved = await userRepository.save(user);

  console.log('Usuario de prueba creado:');
  console.log(`  id:       ${saved.id}`);
  console.log(`  username: ${saved.username}`);
  console.log(`  role:     ${saved.role}`);
  console.log(`  password: ${password} (texto plano, solo para pruebas)`);

  await dataSource.destroy();
}

seedTestUser().catch((error) => {
  console.error('Error al crear el usuario de prueba:', error);
  process.exit(1);
});

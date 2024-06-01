{pkgs}: {
    packages = [
    pkgs.nodejs_20
    pkgs.openssl # << For Prisma
    pkgs.mysql # << In Here
  ];
}
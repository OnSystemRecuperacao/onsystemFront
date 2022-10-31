import {
    AlignmentType,
    Document,
    HeadingLevel,
    ImageRun,
    Packer,
    Paragraph,
    TabStopPosition,
    TabStopType,
    TextRun
} from "docx";

import * as fs from "fs";



export class DocumentCreator {

    // tslint:disable-next-line: typedef
    public create(idOcorrencia, data, observacoes, numeroProcesso, cliente, motivo,prestador, detalhes): Document {
        const document = new Document({
            sections: [
                {
                    children: [
                        new Paragraph({
                            text: "Relatório da ocorrencia " + idOcorrencia,
                            alignment: AlignmentType.CENTER,
                            heading: HeadingLevel.HEADING_1
                        }),
                        this.createContactInfo(cliente, numeroProcesso, prestador, motivo, detalhes),
                        this.createHeading("Chat da ocorrencia"),
                        ...data
                            .map((data: any) => {
                                const arr: Paragraph[] = [];
                                arr.push(
                                    this.createInstitutionHeader(
                                        data.user.name
                                    )
                                );
                                if(data.user.tipoTenancy === 3){
                                    prestador = data.user.name;
                                }
                                // if (data.image !== "") {
                                //     var sliceSize = 512;
                                //     var byteArrays:any = [];
                                  
                                //     arr.push(new Paragraph({
                                //         children: [
                                //             new ImageRun({
                                //                 data: data.bufferImagem,
                                //                 transformation: {
                                //                     width: 50,
                                //                     height: 50,
                                //                 },
                                //             }),
                                //         ],
                                //     }))
                                // }


                                const bulletPoints = this.splitParagraphIntoBullets(
                                    data.text
                                );
                                bulletPoints.forEach(bulletPoint => {
                                    arr.push(this.createBullet(bulletPoint));
                                });

                                arr.push(
                                    this.createRoleText(
                                        '---------------------------------------------------------------'
                                    )
                                );

                                return arr;
                            })
                            .reduce((prev: any, curr: any) => prev.concat(curr), []),
                        this.createHeading("Observações da central Onsystem"),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: observacoes,
                                    italics: true
                                })
                            ]
                           
                        }),
                        
                              

                           
                       
                    ]
                }
            ]
        });

        return document;
    }

    public createContactInfo(
        cliente: string,
        numeroProcesso: string,
        prestador: string,
        motivo: string,
        detalhes: string
    ): Paragraph {
        return new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
                new TextRun(
                    `Cliente : ${cliente}`
                ),
                new TextRun({
                    text: `Numero Processo: ${numeroProcesso}`,
                    break: 1
                }),
                new TextRun({
                    text: `Prestador responsavel: ${prestador}`,
                    break: 1
                }),
                new TextRun({
                    text: `Motivo da ocorrência: ${motivo}`,
                    break: 1
                }),
                new TextRun({
                    text: `Detalhes da ocorrência: ${detalhes}`,
                    break: 1
                }),
              
            ]
        });
    }

    public createHeading(text: string): Paragraph {
        return new Paragraph({
            text: text,
            heading: HeadingLevel.HEADING_1,
            thematicBreak: true
        });
    }

    public createSubHeading(text: string): Paragraph {
        return new Paragraph({
            text: text,
            heading: HeadingLevel.HEADING_2
        });
    }

    public createInstitutionHeader(
        institutionName: string,
    ): Paragraph {
        return new Paragraph({
            tabStops: [
                {
                    type: TabStopType.RIGHT,
                    position: TabStopPosition.MAX
                }
            ],
            children: [
                new TextRun({
                    text: institutionName,
                    bold: true
                })
            ]
        });
    }

    public createRoleText(roleText: string): Paragraph {
        return new Paragraph({
            children: [
                new TextRun({
                    text: roleText,
                    italics: true
                })
            ]
        });
    }

    public createBullet(text: string): Paragraph {
        return new Paragraph({
            children: [
                new TextRun({
                    text: text,
                })
            ]
        });
    }

    // tslint:disable-next-line:no-any
    public createSkillList(skills: any[]): Paragraph {
        return new Paragraph({
            children: [new TextRun(skills.map(skill => skill.name).join(", ") + ".")]
        });
    }

    // tslint:disable-next-line:no-any
    public createAchivementsList(achivements: any[]): Paragraph[] {
        return achivements.map(
            achievement =>
                new Paragraph({
                    text: achievement.name,
                    bullet: {
                        level: 0
                    }
                })
        );
    }

    public createInterests(interests: string): Paragraph {
        return new Paragraph({
            children: [new TextRun(interests)]
        });
    }

    public splitParagraphIntoBullets(text: string): string[] {
        return text.split("\n\n");
    }

    // tslint:disable-next-line:no-any
    public createPositionDateText(
        startDate: any,
        endDate: any,
        isCurrent: boolean
    ): string {
        const startDateText =
            this.getMonthFromInt(startDate.month) + ". " + startDate.year;
        const endDateText = isCurrent
            ? "Present"
            : `${this.getMonthFromInt(endDate.month)}. ${endDate.year}`;

        return `${startDateText} - ${endDateText}`;
    }

    public getMonthFromInt(value: number): string {
        switch (value) {
            case 1:
                return "Jan";
            case 2:
                return "Feb";
            case 3:
                return "Mar";
            case 4:
                return "Apr";
            case 5:
                return "May";
            case 6:
                return "Jun";
            case 7:
                return "Jul";
            case 8:
                return "Aug";
            case 9:
                return "Sept";
            case 10:
                return "Oct";
            case 11:
                return "Nov";
            case 12:
                return "Dec";
            default:
                return "N/A";
        }
    }
}

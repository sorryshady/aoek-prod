import {SchemaTypeDefinition} from 'sanity'

const downloads: SchemaTypeDefinition = {
  name: 'downloads',
  title: 'Downloads',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) =>
        Rule.required().max(80).warning('Titles should be short and descriptive'),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Technical Writing', value: 'technical-writing'},
          {title: 'Circulars & Orders', value: 'circulars-and-orders'},
          {title: 'Election Nomination', value: 'election-nomination'},
          {title: 'IS Codes', value: 'is-codes'},
          {title: 'IRC Codes', value: 'irc-codes'},
          {title: 'Handbooks', value: 'handbooks'},
          {title: 'Others', value: 'others'},
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required().warning('Please select a category'),
    },
    {
      name: 'file',
      title: 'Document',
      type: 'file',
      options: {
        accept: '.pdf,.doc,.docx',
      },
      validation: (Rule) => Rule.required().error('Please upload a document (PDF or DOC format)'),
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'file',
    },
  },
}

export default downloads
